import { On } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import {
  type VoiceBasedChannel,
  CategoryChannel,
  ChannelType,
  GuildMember,
  PermissionFlagsBits,
  VoiceState,
} from 'discord.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GUILD } from 'src/common/constants';
import { Channel } from 'src/bot/entities/channel.entity';
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
  async handleJoin(_: VoiceState, newState: VoiceState) {
    const member = newState.member;
    const channel = newState.channel;
    if (!member || !channel) return;

    await this.ensureUser(member.id);

    const { CHS_CATEGORY_NAME, CH_GENERATOR_NAME } = GUILD;

    if (
      channel.name === CH_GENERATOR_NAME &&
      channel.parent?.name === CHS_CATEGORY_NAME
    ) {
      await this.createPersonalChannel(member, channel.parent);
      return;
    }

    if (
      channel.parent?.name === CHS_CATEGORY_NAME &&
      channel.name !== CH_GENERATOR_NAME
    ) {
      await this.applyAccessRules(member, channel);
    }
  }

  @On('voiceStateUpdate')
  async handleLeave(oldState: VoiceState, newState: VoiceState) {
    const oldChannel = oldState.channel;
    if (!oldChannel) return;
    if (newState.channel?.id === oldChannel.id) return;

    const { CHS_CATEGORY_NAME, CH_GENERATOR_NAME } = GUILD;
    if (oldChannel.parent?.name !== CHS_CATEGORY_NAME) return;
    if (oldChannel.name === CH_GENERATOR_NAME) return;
    if (oldChannel.type !== ChannelType.GuildVoice) return;

    const channelData = await this.channelRepository.findOne({
      where: { channelId: oldChannel.id },
      relations: { owner: true },
    });

    if (oldChannel.members.size === 0) {
      await oldChannel.delete().catch(() => {});
      return;
    }

    if (
      channelData?.owner &&
      oldState.member?.id === channelData.owner.userId
    ) {
      await this.channelRepository.update(
        { channelId: oldChannel.id },
        { owner: null, ownerId: null },
      );
    }
  }

  @On('channelDelete')
  async handleChannelDelete(channel: VoiceBasedChannel) {
    if (channel.parent?.name !== GUILD.CHS_CATEGORY_NAME) return;
    await this.channelRepository.delete({ channelId: channel.id });
  }

  private async ensureUser(userId: string): Promise<User> {
    let user = await this.userRepository.findOne({
      where: { userId },
      relations: { blockedUsers: true, trustedUsers: true },
    });

    if (!user) {
      user = await this.userRepository.save({ userId });
    }

    return user;
  }

  private async applyAccessRules(
    member: GuildMember,
    channel: VoiceBasedChannel,
  ) {
    const channelData = await this.channelRepository.findOne({
      where: { channelId: channel.id },
      relations: { owner: { blockedUsers: true } },
    });

    if (!channelData?.owner) return;

    const isBlocked = channelData.owner.blockedUsers.some(
      (b) => b.blockedId === member.id,
    );
    if (isBlocked) {
      await member.voice.disconnect().catch(() => {});
    }
  }

  private async createPersonalChannel(
    member: GuildMember,
    category: CategoryChannel,
  ) {
    const user = await this.ensureUser(member.id);

    const indexes = await this.channelRepository.find({
      select: { index: true },
    });
    const used = indexes
      .map((el) => parseInt(el.index, 10))
      .filter((num) => !isNaN(num))
      .sort((a, b) => a - b);

    let nextNumber = 1;
    for (const num of used) {
      if (num === nextNumber) nextNumber++;
      else break;
    }

    const name = `Канал [#${nextNumber}]`;

    const permissions = [
      ...user.blockedUsers.map((blocked) => ({
        id: blocked.blockedId,
        deny: [PermissionFlagsBits.Connect, PermissionFlagsBits.ViewChannel],
      })),
      ...user.trustedUsers.map((trusted) => ({
        id: trusted.trustedId,
        allow: [PermissionFlagsBits.Connect, PermissionFlagsBits.ViewChannel],
      })),
    ];

    const created = await category.guild.channels.create({
      name,
      parent: category.id,
      type: ChannelType.GuildVoice,
      bitrate: 96000,
      rtcRegion: 'india',
      permissionOverwrites: permissions,
    });

    try {
      await member.voice.setChannel(created);

      await this.channelRepository.update(
        { ownerId: user.userId },
        { owner: null },
      );

      await this.channelRepository.save({
        channelId: created.id,
        owner: user,
        index: nextNumber.toString(),
        name,
      });
    } catch {
      await created.delete().catch(() => {});
    }
  }
}
