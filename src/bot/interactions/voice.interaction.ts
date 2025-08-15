import { On } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CategoryChannel,
  ChannelType,
  GuildMember,
  VoiceBasedChannel,
  VoiceState,
} from 'discord.js';
import { GUILD } from 'src/common/constants';
import { Channel } from 'src/bot/entities/channel.entity';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class VoiceInteraction {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @On('voiceStateUpdate')
  async handleVoiceJoin(_: VoiceState, newState: VoiceState) {
    const member = newState.member;
    if (!member || !newState.channel) return;

    const channel = newState.channel;
    const categoryName = GUILD.CHS_CATEGORY_NAME;
    const generatorName = GUILD.CH_GENERATOR_NAME;

    if (
      channel.name === generatorName &&
      channel.parent?.name === categoryName
    ) {
      await this.createGeneratedChannel(member, channel.parent);
      return;
    }

    if (
      channel.parent?.name === categoryName &&
      channel.name !== generatorName
    ) {
      await this.handleTrustedAndBlocked(member, channel);
    }
  }

  private async createGeneratedChannel(
    member: GuildMember,
    category: CategoryChannel,
  ) {
    let user = await this.userRepository.findOne({
      where: { userId: member.id },
      relations: ['blockedUsers', 'trustedUsers'],
    });
    if (!user) {
      user = await this.userRepository.save({ userId: member.id });
    }

    const existingIndexes = await this.channelRepository.find({
      select: { index: true },
    });
    const used = existingIndexes
      .map((el) => parseInt(el.index, 10))
      .sort((a, b) => a - b);

    let nextNumber = 1;
    for (const num of used) {
      if (num === nextNumber) nextNumber++;
      else break;
    }

    const name = `Канал [#${nextNumber}]`;
    const createdChannel = await category.guild.channels.create({
      name,
      parent: category.id,
      type: ChannelType.GuildVoice,
      bitrate: 96000,
      rtcRegion: 'india',
    });

    try {
      await member.voice.setChannel(createdChannel);
      await this.channelRepository.save({
        channelId: createdChannel.id,
        owner: user,
        index: nextNumber.toString(),
        name,
      });
    } catch {
      await createdChannel.delete().catch(() => {});
    }
  }

  private async handleTrustedAndBlocked(
    member: GuildMember,
    channel: VoiceBasedChannel,
  ) {
    const channelData = await this.channelRepository.findOne({
      where: { channelId: channel.id },
      relations: { owner: { blockedUsers: true, trustedUsers: true } },
    });

    if (!channelData?.owner) return;

    const isBlocked = channelData.owner.blockedUsers.some(
      (b) => b.blockedId === member.id,
    );
    if (isBlocked) {
      await member.voice.disconnect().catch(() => {});
      return;
    }
  }

  @On('voiceStateUpdate')
  async handleLeave(oldState: VoiceState, newState: VoiceState) {
    if (!oldState.channel) return;
    if (newState.channel?.id === oldState.channel.id) return;

    const oldChannel = oldState.channel;

    if (oldChannel.parent?.name !== GUILD.CHS_CATEGORY_NAME) return;
    if (oldChannel.name === GUILD.CH_GENERATOR_NAME) return;
    if (oldChannel.type !== ChannelType.GuildVoice) return;

    const channel = await this.channelRepository.findOne({
      where: { channelId: oldChannel.id },
      relations: { owner: true },
    });

    if (!channel) return;

    if (oldChannel.members.size === 0) {
      await this.channelRepository.remove(channel);
      await oldChannel.delete().catch(() => {});
      return;
    }

    if (channel.owner && oldState.member?.id === channel.owner.userId) {
      await this.channelRepository.update(
        { channelId: oldChannel.id },
        { owner: null, ownerId: null },
      );
    }
  }
}
