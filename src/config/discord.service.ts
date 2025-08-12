import {
  DiscordModuleOption,
  DiscordOptionsFactory,
} from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GatewayIntentBits, Partials } from 'discord.js';

@Injectable()
export class DiscordConfigService implements DiscordOptionsFactory {
  constructor(private configService: ConfigService) {}
  createDiscordOptions(): Promise<DiscordModuleOption> | DiscordModuleOption {
    return {
      token: this.configService.getOrThrow('token'),
      discordClientOptions: {
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMembers,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.GuildVoiceStates,
        ],
        partials: [Partials.GuildMember, Partials.Channel, Partials.User],
      },
      registerCommandOptions: [
        { forGuild: this.configService.getOrThrow<string>('guildId') },
      ],
    };
  }
}
