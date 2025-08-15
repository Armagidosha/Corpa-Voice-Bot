import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InjectDynamicProviders } from 'nestjs-dynamic-providers';
import { Channel } from 'src/bot/entities/channel.entity';
import { RouteService } from './routeService';
import { TrustedUser } from './entities/trustedUser.entity';
import { User } from './entities/user.entity';
import { BlockedUser } from './entities/blockedUser.entity';
import { CheckRightsService } from './checkRights.service';
import { InteractionExtractorService } from './interactionExtractor.service';

@InjectDynamicProviders('**/commands/*.command.js')
@InjectDynamicProviders('**/interactions/*.interaction.js')
@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, TrustedUser, User, BlockedUser]),
  ],
  providers: [RouteService, CheckRightsService, InteractionExtractorService],
})
export class BotModule {}
