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
import { BlockedUser } from '../entities/blockedUser.entity';
import { TrustedUser } from '../entities/trustedUser.entity';

@Injectable()
export class BlockInteraction {
  constructor(
    private readonly checkRightsService: CheckRightsService,
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

    const voiceChannel = (interaction.member as GuildMember).voice.channel;
    const values = interaction.values;
    const userId = interaction.user.id;
    const guild = interaction.guild;

    const selectedUserId = values[0];
    const targetUser = await guild.members.fetch(selectedUserId);
    const isBot = targetUser.user.bot;

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

    await voiceChannel.permissionOverwrites.edit(targetUser, {
      Connect: false,
      ViewChannel: false,
    });

    await interaction.editReply(`<@${selectedUserId}> заблокирован!`);
  }
}
