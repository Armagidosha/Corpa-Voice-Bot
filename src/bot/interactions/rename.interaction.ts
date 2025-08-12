import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalBuilder,
  ModalSubmitInteraction,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import { CONFIG } from 'src/common/constants';
import { Channel } from 'src/entities/channel.entity';
import { Repository } from 'typeorm';

const channelCooldown = new Map<string, NodeJS.Timeout>();

const input = new ActionRowBuilder<TextInputBuilder>().addComponents(
  new TextInputBuilder({
    customId: CONFIG.INP_RENAME,
    label: 'Новое название',
    style: TextInputStyle.Short,
  }),
);

const modal = new ModalBuilder({
  customId: CONFIG.MODAL_RENAME,
  title: 'Переименовать канал',
  components: [input],
});

@Injectable()
export class ChannelRenameInteraction {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
  ) {}

  async onButtonInteract(interaction: ButtonInteraction) {
    const member = interaction.guild?.members.cache.get(interaction.user.id);
    const channel = member?.voice.channel;

    if (channelCooldown.has(channel.id)) {
      await interaction.reply({
        content: 'Этот канал можно переименовывать не чаще, чем раз в 5 минут.',
        flags: 'Ephemeral',
      });
      return;
    }

    await interaction.showModal(modal);
  }

  async onModalInteract(interaction: ModalSubmitInteraction) {
    await interaction.deferReply({ flags: 'Ephemeral' });
    const newName = interaction.fields.getTextInputValue(CONFIG.INP_RENAME);
    const member = interaction.guild?.members.cache.get(interaction.user.id);
    const channel = member?.voice.channel;

    const timeout = setTimeout(
      () => {
        channelCooldown.delete(channel.id);
      },
      5 * 60 * 1000,
    );

    if (!newName || newName.length > 100) {
      await interaction.editReply({
        content: 'Название канала должно быть от 1 до 100 символов.',
      });
      return;
    }

    const channelData = await this.channelRepository.findOne({
      where: { channelId: channel.id },
    });
    if (!channelData) {
      await interaction.editReply({
        content: 'Данные не найдены в БД, пересоздайте канал.',
      });
      return;
    }

    channelCooldown.set(channel.id, timeout);

    const updatedName = `${newName} [#${channelData.channelIndex}]`;
    await channel.edit({ name: updatedName });

    await interaction.editReply({
      content: `Голосовой канал успешно переименован в **"${newName}"**.`,
    });
  }
}
