import { On } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelType, VoiceState } from 'discord.js';
import { GUILD } from 'src/common/constants';
import { Channel } from 'src/entities/channel.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VoiceInteraction {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
  ) {}

  @On('voiceStateUpdate')
  async handleJoin(_: VoiceState, newState: VoiceState) {
    const generatorName = GUILD.CH_GENERATOR_NAME;
    const categoryName = GUILD.CHS_CATEGORY_NAME;

    const newChannel = newState.channel;
    if (!newChannel) return;
    if (newChannel.name !== generatorName) return;
    if (newChannel.parent?.name !== categoryName) return;

    const category = newChannel.parent;
    if (!category) return;

    const existingIndexes = await this.channelRepository.find({
      select: { channelIndex: true },
    });

    const used = existingIndexes
      .map((e) => parseInt(e.channelIndex, 10))
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
      rtcRegion: 'rotterdam',
    });

    try {
      await newState.member.voice.setChannel(createdChannel);
      await this.channelRepository.save({
        channelId: createdChannel.id,
        ownerId: newState.member.id,
        privacy: 'public',
        channelIndex: nextNumber.toString(),
        channelName: 'Канал ',
      });
    } catch {
      await createdChannel.delete().catch(() => {});
      return;
    }
  }

  @On('voiceStateUpdate')
  async handleLeave(oldState: VoiceState) {
    const oldChannel = oldState.channel;
    if (!oldChannel) return;
    if (oldChannel.parent?.name !== GUILD.CHS_CATEGORY_NAME) return;
    if (oldChannel.name === GUILD.CH_GENERATOR_NAME) return;
    if (oldChannel.type !== ChannelType.GuildVoice) return;

    if (oldChannel.members.size === 0) {
      const channel = await this.channelRepository.findOne({
        where: { channelId: oldChannel.id },
      });

      if (channel) {
        await this.channelRepository.remove(channel);
      }

      await oldChannel.delete().catch(() => {});
    }
  }
}
