import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

import {
  ButtonInteraction,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
  UserSelectMenuInteraction,
} from 'discord.js';

@Injectable()
export class CheckRightsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async check(
    interaction:
      | ButtonInteraction
      | StringSelectMenuInteraction
      | ModalSubmitInteraction
      | UserSelectMenuInteraction,
  ) {
    const userId = interaction.user.id;
    const member = interaction.guild?.members.cache.get(userId);
    const voiceChannel = member?.voice.channel;

    const channelOwner = await this.userRepo.findOne({
      where: { channel: { channelId: voiceChannel.id } },
      relations: { channel: true, trustedUsers: true, blockedUsers: true },
    });

    if (!channelOwner) {
      return { isOwner: false, isBlocked: false, isTrusted: false };
    }

    const isOwner = channelOwner.userId === userId;
    const isTrusted = channelOwner.trustedUsers.some(
      (tu) => tu.trustedId === userId,
    );
    const isBlocked = channelOwner.blockedUsers.some(
      (bu) => bu.blockedId === userId,
    );

    return { isOwner, isBlocked, isTrusted };
  }
}
