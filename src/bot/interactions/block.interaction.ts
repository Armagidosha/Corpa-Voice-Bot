import { Injectable } from '@nestjs/common';
import {
  ActionRowBuilder,
  ButtonInteraction,
  UserSelectMenuBuilder,
  UserSelectMenuInteraction,
} from 'discord.js';
import { CheckRightsService } from '../checkRights.service';
import { CONFIG, INP_CONTENT, MESSAGES } from 'src/common/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { BlockedUser } from '../entities/blockedUser.entity';
import { Repository } from 'typeorm';
import { InteractionExtractorService } from '../interactionExtractor.service';
import { TrustedUser } from '../entities/trustedUser.entity';

@Injectable()
export class BlockInteraction {
  constructor(
    private readonly checkRightsService: CheckRightsService,
    private readonly interactionExtractor: InteractionExtractorService,
    @InjectRepository(BlockedUser)
    private readonly blockedUserRepository: Repository<BlockedUser>,
    @InjectRepository(TrustedUser)
    private readonly trustedUserRepository: Repository<TrustedUser>,
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
        .setCustomId(CONFIG.INP_BLOCK)
        .setPlaceholder(INP_CONTENT.block_select)
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

    const isExists = await this.blockedUserRepository.findOne({
      where: { blockedId: selectedUserId, ownerId: userId },
    });

    if (isExists) {
      await interaction.editReply(MESSAGES.ALREADY_BANNED);
      return;
    }

    const isTrusted = await this.trustedUserRepository.findOne({
      where: { trustedId: selectedUserId, ownerId: userId },
    });

    if (isTrusted) {
      await interaction.editReply(MESSAGES.USER_IS_TRUSTED);
      return;
    }

    await this.blockedUserRepository.insert({
      blockedId: selectedUserId,
      ownerId: userId,
    });

    await voiceChannel.permissionOverwrites.edit(user, {
      Connect: false,
      ViewChannel: false,
    });

    await interaction.editReply(`<@${selectedUserId}> заблокирован!`);
  }
}
