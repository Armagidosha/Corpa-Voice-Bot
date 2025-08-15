import { Injectable } from '@nestjs/common';
import {
  ActionRowBuilder,
  ButtonInteraction,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
} from 'discord.js';
import { CONFIG, MESSAGES, regionConfig } from 'src/common/constants';

const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
  new StringSelectMenuBuilder()
    .setCustomId(CONFIG.INP_SET_REGION)
    .setPlaceholder(MESSAGES.MAKE_A_CHOICE)
    .addOptions(regionConfig),
);

@Injectable()
export class RegionInteraction {
  async onButtonInteract(interaction: ButtonInteraction) {
    await interaction.reply({
      content: 'Выберите регион',
      flags: 'Ephemeral',
      components: [row],
    });
  }

  async onInputInteract(interaction: StringSelectMenuInteraction) {
    await interaction.deferReply({ flags: 'Ephemeral' });

    const value = interaction.values[0];

    if (!value) {
      await interaction.editReply(MESSAGES.IMPORTANT_CHOICE);
    }

    const member = interaction.guild?.members.cache.get(interaction.user.id);
    const channel = member?.voice.channel;

    await channel.edit({ rtcRegion: value === 'auto' ? null : value });
    await interaction.editReply(`Регион успешно изменен (${value})`);
  }
}
