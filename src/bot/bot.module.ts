import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InjectDynamicProviders } from 'nestjs-dynamic-providers';
import { Channel } from 'src/entities/channel.entity';
import { TrustedUser } from 'src/entities/user.entity';
import { RouteService } from './routeService';

@InjectDynamicProviders('**/commands/*.command.js')
@InjectDynamicProviders('**/interactions/*.interaction.js')
@Module({
  imports: [TypeOrmModule.forFeature([Channel, TrustedUser])],
  providers: [RouteService],
})
export class BotModule {}
