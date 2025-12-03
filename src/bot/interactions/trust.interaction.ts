import { Injectable } from '@nestjs/common';
import {
  ActionRowBuilder,
  ButtonInteraction,
  GuildMember,
  UserSelectMenuBuilder,
  UserSelectMenuInteraction,
} from 'discord.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckRightsService } from '../extra/checkRights.service';
import { CONFIG, INP_CONTENT, MESSAGES } from 'src/common/constants';
import { TrustedUser } from '../entities/trustedUser.entity';
import { BlockedUser } from '../entities/blockedUser.entity';

@Injectable()
export class TrustInteraction {
  constructor(
    private readonly checkRightsService: CheckRightsService,
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

    const voiceChannel = (interaction.member as GuildMember).voice.channel;
    const userId = interaction.user.id;
    const values = interaction.values;
    const guild = interaction.guild;

    const selectedUserId = values[0];
    const targetUser = await guild.members.fetch(selectedUserId);
    const isBot = targetUser.user.bot;

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

    await voiceChannel.permissionOverwrites.edit(targetUser, {
      Connect: true,
      ViewChannel: true,
    });

    await interaction.editReply(`<@${selectedUserId}> теперь модератор`);
  }
}
