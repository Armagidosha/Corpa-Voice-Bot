import { Injectable } from '@nestjs/common';
import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalBuilder,
  ModalSubmitInteraction,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import { CONFIG } from 'src/common/constants';

const input = new ActionRowBuilder<TextInputBuilder>().addComponents(
  new TextInputBuilder({
    customId: CONFIG.INP_SET_LIMIT,
    label: 'Новое название',
    style: TextInputStyle.Short,
  }),
);

const modal = new ModalBuilder({
  customId: CONFIG.MODAL_SET_LIMIT,
  title: 'Переименовать канал',
  components: [input],
});

@Injectable()
export class LimitInteraction {
  async onButtonInteract(interaction: ButtonInteraction) {
    //TODO: Требуется интеграция с БД для проверки на владельца канала
    await interaction.showModal(modal);
  }

  async onModalInteract(interaction: ModalSubmitInteraction) {
    await interaction.deferReply({ flags: 'Ephemeral' });
    const newLimitRaw = interaction.fields.getTextInputValue(
      CONFIG.INP_SET_LIMIT,
    );
    const newLimit = parseInt(newLimitRaw, 10);

    const member = interaction.guild?.members.cache.get(interaction.user.id);
    const channel = member?.voice.channel;

    if (isNaN(newLimit) || newLimit < 0 || newLimit > 99) {
      await interaction.editReply({
        content: 'Лимит должен быть от 0 до 99 (0 - убрать лимит).',
      });
      return;
    }

    await channel.edit({ userLimit: newLimit });
    await interaction.editReply({
      content: newLimit
        ? `Лимит канала установлен на **${newLimit}**.`
        : 'Лимит канала **убран**.',
    });
  }
}
