import { Injectable } from '@nestjs/common';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
  GuildMember,
  PermissionsBitField,
} from 'discord.js';
import { CheckRightsService } from '../extra/checkRights.service';
import { CONFIG, MESSAGES } from 'src/common/constants';

const embed = new EmbedBuilder()
  .setTitle('Настройка приватности')
  .setColor(0x808080)
  .setDescription(
    'Скрытый канал будет виден только вам, модераторам и приглашенным людям. Видимый канал будет виден всем. Обе кнопки делают канал недоступным для подключения. Чтобы открыть канал нажмите кнопку приватности еще раз.',
  );

const row = [
  new ActionRowBuilder<ButtonBuilder>().addComponents([
    new ButtonBuilder()
      .setCustomId(CONFIG.BTN_PRIVACY_VISIBLE)
      .setLabel('Видимый')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(CONFIG.BTN_PRIVACY_HIDDEN)
      .setLabel('Скрытый')
      .setStyle(ButtonStyle.Secondary),
  ]),
];

@Injectable()
export class PrivacyInteraction {
  constructor(private readonly checkRightsService: CheckRightsService) {}

  async onButtonInteract(interaction: ButtonInteraction) {
    await interaction.deferReply({ flags: 'Ephemeral' });

    const { isOwner, isTrusted } =
      await this.checkRightsService.check(interaction);

    if (!isOwner && !isTrusted) {
      await interaction.editReply(MESSAGES.NO_RIGHTS);
      return;
    }

    const voiceChannel = (interaction.member as GuildMember).voice.channel;
    const guild = interaction.guild;

    const everyone = guild.roles.everyone;
    const currentPerms = voiceChannel.permissionsFor(everyone);

    const isPrivate = !currentPerms.has(PermissionsBitField.Flags.Connect);

    if (isPrivate) {
      await voiceChannel.permissionOverwrites.edit(everyone, {
        Connect: true,
        ViewChannel: true,
      });

      return await interaction.editReply('Канал теперь публичный.');
    }

    await interaction.editReply({ embeds: [embed], components: row });
  }

  async onActionButtonInteract(interaction: ButtonInteraction) {
    await interaction.deferReply({ flags: 'Ephemeral' });

    const { isOwner, isTrusted } =
      await this.checkRightsService.check(interaction);

    if (!isOwner && !isTrusted) {
      await interaction.editReply(MESSAGES.NO_RIGHTS);
      return;
    }

    const customId = interaction.customId;

    const voiceChannel = (interaction.member as GuildMember).voice.channel;
    const guild = interaction.guild;

    const everyone = guild.roles.everyone;

    const isHidden = customId === CONFIG.BTN_PRIVACY_HIDDEN;

    await voiceChannel.permissionOverwrites.edit(everyone, {
      Connect: false,
      ViewChannel: isHidden ? false : null,
    });

    await interaction.editReply(
      `Канал теперь приватный. (${isHidden ? 'Скрытый' : 'Видимый'})`,
    );
  }
}
