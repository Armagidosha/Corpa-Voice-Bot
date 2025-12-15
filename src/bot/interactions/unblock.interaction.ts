import { Injectable } from '@nestjs/common';
import {
  ActionRowBuilder,
  ButtonInteraction,
  GuildMember,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
} from 'discord.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckRightsService } from '../extra/checkRights.service';
import { CONFIG, INP_CONTENT, MESSAGES } from 'src/common/constants';
import { BlockedUser } from '../entities/blockedUser.entity';

@Injectable()
export class UnblockInteraction {
  constructor(
    private readonly checkRightsService: CheckRightsService,
    @InjectRepository(BlockedUser)
    private readonly blockedRepository: Repository<BlockedUser>,
  ) {}

  async onButtonInteract(interaction: ButtonInteraction) {
    await interaction.deferReply({ flags: 'Ephemeral' });

    const { isOwner } = await this.checkRightsService.check(interaction);

    if (!isOwner) {
      await interaction.editReply(MESSAGES.NO_RIGHTS);
      return;
    }

    const userId = interaction.user.id;
    const guildMembers = interaction.guild.members.cache;

    const blockedUsers = await this.blockedRepository.find({
      where: { ownerId: userId },
    });

    const blockedIds = blockedUsers.map((user) => user.blockedId);

    const selectOptions = guildMembers
      .filter((memb) => blockedIds.includes(memb.user.id))
      .map((memb) => ({ label: memb.displayName, value: memb.id }));

    if (!selectOptions.length) {
      await interaction.editReply(MESSAGES.BAN_LIST_EMPTY);
      return;
    }

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(CONFIG.INP_UNBLOCK)
        .setPlaceholder(INP_CONTENT.unblock_select)
        .addOptions(selectOptions),
    );

    await interaction.editReply({
      content: MESSAGES.IMPORTANT_CHOICE,
      components: [row],
    });
  }

  async onInputInteract(interaction: StringSelectMenuInteraction) {
    await interaction.deferReply({ flags: 'Ephemeral' });

    const { isOwner } = await this.checkRightsService.check(interaction);

    if (!isOwner) {
      await interaction.editReply(MESSAGES.NO_RIGHTS);
      return;
    }

    const voiceChannel = (interaction.member as GuildMember).voice.channel;
    const values = interaction.values;
    const guild = interaction.guild;

    const selectedUserId = values[0];

    const blockedUserData = await this.blockedRepository.findOne({
      where: { blockedId: selectedUserId },
    });

    if (!blockedUserData) {
      await interaction.editReply(MESSAGES.BLOCKED_USER_NOT_FOUND);
      return;
    }

    const blockedUser = await guild.members.fetch(selectedUserId);

    await this.blockedRepository.remove(blockedUserData);
    await voiceChannel.permissionOverwrites.delete(blockedUser);
    await interaction.editReply(`<@${selectedUserId}> разблокирован!`);
  }
}
