import { Injectable } from '@nestjs/common';
import {
  ActionRowBuilder,
  ButtonInteraction,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
} from 'discord.js';
import { CONFIG } from 'src/common/constants';

const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
  new StringSelectMenuBuilder()
    .setCustomId(CONFIG.INP_SET_REGION)
    .setPlaceholder('Выбери уже что-нибудь')
    .addOptions([
      {
        label: 'Передать штурвал судьбе',
        description: 'Автоматический выбор региона с низкой задержкой.',
        value: 'auto',
      },
      {
        label: 'Вротдам',
        description: 'Нидерланды, Роттердам. Наиболее оптимальный регион.',
        value: 'rotterdam',
      },
      {
        label: 'О, привет, Болливуд!',
        description:
          'Индийский регион, где пинг танцует ламбаду, а задержка приходит с приправой карри и щепоткой хаоса.',
        value: 'india',
      },
      {
        label: 'Восточная Америка',
        description:
          'Поздравляю, вы иностранный агент, живете на 10 секунд позже, зато в Америке.',
        value: 'us-west',
      },
    ]),
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
      await interaction.editReply({ content: 'Нужно что-то выбрать.' });
    }

    const member = interaction.guild?.members.cache.get(interaction.user.id);
    const channel = member?.voice.channel;

    await channel.edit({ rtcRegion: value === 'auto' ? null : value });
    await interaction.editReply({ content: 'Регион успешно изменен.' });
  }
}
