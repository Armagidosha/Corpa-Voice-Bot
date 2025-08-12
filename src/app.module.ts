import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscordModule } from '@discord-nestjs/core';
import Configuration from './config/env.config';
import { DiscordConfigService } from './config/discord.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm.service';
import { BotModule } from './bot/bot.module';
import { WinstonModule } from 'nest-winston';
import { WinstonConfigService } from './config/winston.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [Configuration],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    DiscordModule.forRootAsync({ useClass: DiscordConfigService }),
    WinstonModule.forRootAsync({ useClass: WinstonConfigService }),
    BotModule,
  ],
})
export class AppModule {}
