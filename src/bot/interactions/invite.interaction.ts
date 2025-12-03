import { Injectable } from '@nestjs/common';
import {
  ActionRowBuilder,
  ButtonInteraction,
  GuildMember,
  UserSelectMenuBuilder,
  UserSelectMenuInteraction,
} from 'discord.js';
import { CONFIG, INP_CONTENT, MESSAGES } from 'src/common/constants';
import { CheckRightsService } from '../extra/checkRights.service';

@Injectable()
export class InviteInteraction {
  constructor(private readonly checkRightsService: CheckRightsService) {}

  async onButtonInteract(interaction: ButtonInteraction) {
    await interaction.deferReply({ flags: 'Ephemeral' });

    const { isOwner, isTrusted } =
      await this.checkRightsService.check(interaction);

    if (!isOwner && !isTrusted) {
      await interaction.editReply(MESSAGES.NO_RIGHTS);
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

    const voiceChannel = (interaction.member as GuildMember).voice.channel;
    const user = interaction.user;
    const userId = user.id;
    const guild = interaction.guild;
    const values = interaction.values;

    const selectedUserId = values[0];
    const targetUser = await guild.members.fetch(selectedUserId);
    const isBot = targetUser.user.bot;

    if (targetUser.id === userId || isBot) {
      await interaction.editReply(MESSAGES.SELF_OR_BOT_SELECTED);
      return;
    }

    const invitedUserChannel = targetUser.voice.channel;

    if (invitedUserChannel && invitedUserChannel.id === voiceChannel.id) {
      await interaction.editReply(MESSAGES.CANT_INVITE_USER_IN_CHANNEL);
      return;
    }

    let reply = `<@${targetUser.id}> был приглашен в твой голосовой канал.`;

    await voiceChannel.permissionOverwrites.edit(targetUser, {
      Connect: true,
    });

    try {
      await targetUser.send(
        `<@${userId}> пригласили тебя в голосовой канал <#${voiceChannel.id}>.`,
      );
    } catch {
      reply += ' Но он не получил приглашение в личных сообщениях.';
    }
    await interaction.editReply(reply);
  }
}
