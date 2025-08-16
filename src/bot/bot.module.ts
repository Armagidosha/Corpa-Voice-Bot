import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscordModule } from '@discord-nestjs/core';
import { InjectDynamicProviders } from 'nestjs-dynamic-providers';
import { Channel } from 'src/bot/entities/channel.entity';
import { TrustedUser } from './entities/trustedUser.entity';
import { User } from './entities/user.entity';
import { BlockedUser } from './entities/blockedUser.entity';

@InjectDynamicProviders('**/commands/*.command.js')
@InjectDynamicProviders('**/interactions/*.interaction.js')
@InjectDynamicProviders('**/extra/*.service.js')
@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, TrustedUser, User, BlockedUser]),
    DiscordModule.forFeature(),
  ],
})
export class BotModule {}
