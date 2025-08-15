import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ActionRowBuilder,
  ButtonInteraction,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
} from 'discord.js';
import { CheckRightsService } from '../checkRights.service';
import { InteractionExtractorService } from '../interactionExtractor.service';
import { TrustedUser } from '../entities/trustedUser.entity';
import { Repository } from 'typeorm';
import { CONFIG, INP_CONTENT, MESSAGES } from 'src/common/constants';

@Injectable()
export class UntrustInteraction {
  constructor(
    private readonly checkRightsService: CheckRightsService,
    private readonly interactionExtractor: InteractionExtractorService,
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

    const { userId, guildMembers } =
      await this.interactionExtractor.extract(interaction);

    const trustedUsers = await this.trustedUserRepository.find({
      where: { ownerId: userId },
    });

    const trustedIds = trustedUsers.map((user) => user.trustedId);

    const selectOptions = guildMembers
      .filter((memb) => trustedIds.includes(memb.user.id))
      .map((memb) => ({ label: memb.displayName, value: memb.id }));

    if (!selectOptions.length) {
      await interaction.editReply(MESSAGES.TRUST_LIST_EMPTY);
      return;
    }

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(CONFIG.INP_UNTRUST)
        .setPlaceholder(INP_CONTENT.trust_del_select)
        .addOptions(selectOptions),
    );

    await interaction.editReply({
      content: MESSAGES.IMPORTANT_CHOICE,
      components: [row],
    });
  }

  async onInputInteract(interaction: StringSelectMenuInteraction) {
    await interaction.deferReply({ flags: 'Ephemeral' });
    const { values, voiceChannel, guild } =
      await this.interactionExtractor.extract(interaction);

    const selectedUserId = values[0];

    const trustedUserData = await this.trustedUserRepository.findOne({
      where: { trustedId: selectedUserId },
    });

    if (!trustedUserData) {
      await interaction.editReply(MESSAGES.TRUSTED_USER_NOT_FOUND);
      return;
    }

    const trustedUser = await guild.members.fetch(selectedUserId);

    await this.trustedUserRepository.remove(trustedUserData);
    await voiceChannel.permissionOverwrites.delete(trustedUser);
    await interaction.editReply(
      `<@${selectedUserId}> удален из списка модераторов!`,
    );
  }
}
