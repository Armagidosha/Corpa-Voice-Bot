import { Injectable } from '@nestjs/common';
import {
  ActionRowBuilder,
  ButtonInteraction,
  PermissionsBitField,
  UserSelectMenuBuilder,
  UserSelectMenuInteraction,
} from 'discord.js';
import { CONFIG, INP_CONTENT, MESSAGES } from 'src/common/constants';
import { CheckRightsService } from '../extra/checkRights.service';
import { InteractionExtractorService } from '../extra/interactionExtractor.service';

@Injectable()
export class InviteInteraction {
  constructor(
    private readonly checkRightsService: CheckRightsService,
    private readonly interactionExtractor: InteractionExtractorService,
  ) {}

  async onButtonInteract(interaction: ButtonInteraction) {
    await interaction.deferReply({ flags: 'Ephemeral' });

    const { isOwner, isTrusted } =
      await this.checkRightsService.check(interaction);

    if (!isOwner && !isTrusted) {
      await interaction.editReply(MESSAGES.NO_RIGHTS);
      return;
    }

    const { voiceChannel, guild } =
      await this.interactionExtractor.extract(interaction);

    const everyone = guild.roles.everyone;

    if (
      voiceChannel
        .permissionsFor(everyone)
        .has(PermissionsBitField.Flags.Connect)
    ) {
      await interaction.editReply(MESSAGES.CHANNEL_SHOULD_BE_PRIVATE);
      return;
    }

    const row = new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
      new UserSelectMenuBuilder()
        .setCustomId(CONFIG.INP_INVITE)
        .setPlaceholder(INP_CONTENT.invite_select),
    );

    await interaction.editReply({
      content: MESSAGES.IMPORTANT_CHOICE,
      components: [row],
    });
  }

  async onInputInteract(interaction: UserSelectMenuInteraction) {
    await interaction.deferReply({ flags: 'Ephemeral' });

    const { voiceChannel, user, userId, guild, values, guildMembers } =
      await this.interactionExtractor.extract(interaction);

    const selectedUserId = values[0];
    const invitedUser = await guild.members.fetch(selectedUserId);
    const isBot = user.bot;

    if (invitedUser.id === userId || isBot) {
      await interaction.editReply(MESSAGES.SELF_OR_BOT_SELECTED);
      return;
    }

    const membersId = voiceChannel.members.map((user) => user.id);
    const filterInChannel = guildMembers.filter((memb) =>
      membersId.includes(memb.id),
    );

    if (filterInChannel.has(userId)) {
      await interaction.editReply(MESSAGES.CANT_INVITE_USER_IN_CHANNEL);
      return;
    }

    let reply = `<@${invitedUser.id}> теперь может посещать твой канал.`;

    await voiceChannel.permissionOverwrites.edit(invitedUser, {
      Connect: true,
    });

    try {
      await invitedUser.send(
        `<@${userId}> пригласили тебя в голосовой канал <#${voiceChannel.id}>.`,
      );
    } catch {
      reply += 'Но он не получил приглашение в личных сообщениях.';
    }
    await interaction.editReply(reply);
  }
}
