import { InjectDiscordClient } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelType, Client, GuildBasedChannel } from 'discord.js';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Channel } from '../entities/channel.entity';

@Injectable()
export class ChannelSyncService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    @InjectDiscordClient()
    private readonly client: Client,
    private readonly configService: ConfigService,
  ) {}

  public async fixChannels() {
    const guild = this.client.guilds.cache.get(
      this.configService.get<string>('guildId'),
    );

    if (!guild) return;

    const channels = await this.channelRepository.find();

    for (const ch of channels) {
      let discordChannel: GuildBasedChannel | null = null;

      try {
        discordChannel = await guild.channels.fetch(ch.channelId);
      } catch {
        await this.channelRepository.delete({ channelId: ch.channelId });
        continue;
      }

      if (!discordChannel) {
        await this.channelRepository.delete({ channelId: ch.channelId });
        continue;
      }

      if (
        discordChannel.type === ChannelType.GuildVoice &&
        discordChannel.members.size === 0
      ) {
        await this.channelRepository.delete({ channelId: ch.channelId });
        await discordChannel.delete().catch(() => {});
      }
    }
  }

  async onApplicationBootstrap() {
    await this.fixChannels();
  }
}
