import { Injectable } from '@nestjs/common';
import {
  ActionRowBuilder,
  ButtonInteraction,
  UserSelectMenuBuilder,
  UserSelectMenuInteraction,
} from 'discord.js';
import { CheckRightsService } from '../checkRights.service';
import { InteractionExtractorService } from '../interactionExtractor.service';
import { CONFIG, INP_CONTENT, MESSAGES } from 'src/common/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { TrustedUser } from '../entities/trustedUser.entity';
import { Repository } from 'typeorm';
import { BlockedUser } from '../entities/blockedUser.entity';

@Injectable()
export class TrustInteraction {
  constructor(
    private readonly checkRightsService: CheckRightsService,
    private readonly interactionExtractor: InteractionExtractorService,
    @InjectRepository(TrustedUser)
    private readonly trustedUserRepository: Repository<TrustedUser>,
    @InjectRepository(BlockedUser)
    private readonly blockedUserRepository: Repository<BlockedUser>,
  ) {}

  async onButtonInteract(interaction: ButtonInteraction) {
    await interaction.deferReply({ flags: 'Ephemeral' });

    const { isOwner } = await this.checkRightsService.check(interaction);

    if (!isOwner) {
      await interaction.editReply(MESSAGES.NO_RIGHTS);
      return;
    }

    const row = new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
      new UserSelectMenuBuilder()
        .setCustomId(CONFIG.INP_TRUST)
        .setPlaceholder(INP_CONTENT.trust_add_select)
        .setMaxValues(1),
    );

    await interaction.editReply({
      content: MESSAGES.IMPORTANT_CHOICE,
      components: [row],
    });
  }

  async onInputInteract(interaction: UserSelectMenuInteraction) {
    await interaction.deferReply({ flags: 'Ephemeral' });
    const { values, userId, guild, voiceChannel } =
      await this.interactionExtractor.extract(interaction);

    const selectedUserId = values[0];
    const user = await guild.members.fetch(selectedUserId);
    const isBot = user.user.bot;

    if (selectedUserId === userId || isBot) {
      await interaction.editReply(MESSAGES.SELF_OR_BOT_SELECTED);
      return;
    }

    const isExists = await this.trustedUserRepository.findOne({
      where: { trustedId: selectedUserId, ownerId: userId },
    });

    if (isExists) {
      await interaction.editReply(MESSAGES.ALREADY_TRUSTED);
      return;
    }

    const isBlocked = await this.blockedUserRepository.findOne({
      where: {
        blockedId: selectedUserId,
        ownerId: userId,
      },
    });

    if (isBlocked) {
      await interaction.editReply(MESSAGES.USER_IS_BLOCKED);
      return;
    }

    await this.trustedUserRepository.insert({
      trustedId: selectedUserId,
      ownerId: userId,
    });

    await voiceChannel.permissionOverwrites.edit(user, {
      Connect: true,
      ViewChannel: true,
    });

    await interaction.editReply(`<@${selectedUserId}> теперь модератор`);
  }
}
