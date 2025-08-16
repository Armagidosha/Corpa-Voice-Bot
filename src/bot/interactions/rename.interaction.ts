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
import { Repository } from 'typeorm';
import { CONFIG, INP_CONTENT, MESSAGES } from 'src/common/constants';
import { Channel } from 'src/bot/entities/channel.entity';

const channelCooldown = new Map<string, NodeJS.Timeout>();

const input = new ActionRowBuilder<TextInputBuilder>().addComponents(
  new TextInputBuilder({
    customId: CONFIG.INP_RENAME,
    label: INP_CONTENT.rename_input,
    style: TextInputStyle.Short,
  }),
);

const modal = new ModalBuilder({
  customId: CONFIG.MODAL_RENAME,
  title: MESSAGES.IMPORTANT_CHOICE,
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
        content: MESSAGES.RENAME_COOLDOWN,
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
      await interaction.editReply(MESSAGES.INVALID_CHANNEL_NAME);
      return;
    }

    const channelData = await this.channelRepository.findOne({
      where: { channelId: channel.id },
    });
    if (!channelData) {
      await interaction.editReply(MESSAGES.NO_DATA);
      return;
    }

    channelCooldown.set(channel.id, timeout);

    const updatedName = `${newName} [#${channelData.index}]`;
    await channel.edit({ name: updatedName });

    await interaction.editReply(
      `Голосовой канал успешно переименован в **"${newName}"**.`,
    );
  }
}
