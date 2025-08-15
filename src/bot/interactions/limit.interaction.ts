import { Injectable } from '@nestjs/common';
import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalBuilder,
  ModalSubmitInteraction,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import { CONFIG, INP_CONTENT, MESSAGES } from 'src/common/constants';
import { CheckRightsService } from '../checkRights.service';
import { InteractionExtractorService } from '../interactionExtractor.service';

const input = new ActionRowBuilder<TextInputBuilder>().addComponents(
  new TextInputBuilder({
    customId: CONFIG.INP_SET_LIMIT,
    label: INP_CONTENT.limit_input,
    style: TextInputStyle.Short,
  }),
);

const modal = new ModalBuilder({
  customId: CONFIG.MODAL_SET_LIMIT,
  title: MESSAGES.IMPORTANT_CHOICE,
  components: [input],
});

@Injectable()
export class LimitInteraction {
  constructor(
    private readonly checkRightsService: CheckRightsService,
    private readonly interactionExtractor: InteractionExtractorService,
  ) {}
  async onButtonInteract(interaction: ButtonInteraction) {
    const { isOwner, isTrusted } =
      await this.checkRightsService.check(interaction);

    if (!isOwner && !isTrusted) {
      await interaction.reply({
        content: MESSAGES.NO_RIGHTS,
        flags: 'Ephemeral',
      });
      return;
    }

    await interaction.showModal(modal);
  }

  async onModalInteract(interaction: ModalSubmitInteraction) {
    await interaction.deferReply({ flags: 'Ephemeral' });
    const { fields, voiceChannel } =
      await this.interactionExtractor.extract(interaction);

    const newLimit = parseInt(fields[0], 10);

    console.log(isNaN(newLimit) || newLimit < 0 || newLimit > 99);

    if (isNaN(newLimit) || newLimit < 0 || newLimit > 99) {
      await interaction.editReply(MESSAGES.INVALID_CHANNEL_LIMIT);
      return;
    }

    await voiceChannel.edit({ userLimit: newLimit });
    await interaction.editReply(
      newLimit
        ? `Лимит канала установлен на **${newLimit}**.`
        : 'Лимит канала **убран**.',
    );
  }
}
