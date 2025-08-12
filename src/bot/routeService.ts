import { On } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import {
  ButtonInteraction,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
} from 'discord.js';
import type { Interaction } from 'discord.js';
import { CONFIG } from 'src/common/constants';
import { PrivacyInteraction } from './interactions/privacy.interaction';
import { LimitInteraction } from './interactions/limit.interaction';
import { InviteInteraction } from './interactions/invite.interaction';
import { DeleteChannelInteraction } from './interactions/delete.interaction';
import { RegionInteraction } from './interactions/region.interaction';
import { ChannelRenameInteraction } from './interactions/rename.interaction';
import { InVoiceHandler } from 'src/common/Decorators/customHandler';
import { TransferInteraction } from './interactions/transfer.interaction';

@Injectable()
export class RouteService {
  private readonly buttonHandlerMap: Record<
    string,
    (i: ButtonInteraction) => Promise<void> | void
  >;
  private readonly modalHandlerMap: Record<
    string,
    (i: ModalSubmitInteraction) => Promise<void> | void
  >;
  private readonly inputHandlerMap: Record<
    string,
    (i: StringSelectMenuInteraction) => Promise<void> | void
  >;

  constructor(
    private readonly privacyI: PrivacyInteraction,
    private readonly limitI: LimitInteraction,
    private readonly inviteI: InviteInteraction,
    private readonly deleteI: DeleteChannelInteraction,
    private readonly regionI: RegionInteraction,
    private readonly renameI: ChannelRenameInteraction,
    private readonly transferI: TransferInteraction,
  ) {
    this.buttonHandlerMap = {
      [CONFIG.BTN_PRIVACY]: (i) => this.privacyI.onButtonInteract(i),
      [CONFIG.BTN_RENAME]: (i) => this.renameI.onButtonInteract(i),
      [CONFIG.BTN_LIMIT]: (i) => this.limitI.onButtonInteract(i),
      [CONFIG.BTN_REGION]: (i) => this.regionI.onButtonInteract(i),
      [CONFIG.BTN_DELETE]: (i) => this.deleteI.onButtonInteract(i),
      [CONFIG.BTN_INVITE]: (i) => this.inviteI.onButtonInteract(i),
      // Остальные кнопки пока пустые
      [CONFIG.BTN_KICK]: () => {},
      [CONFIG.BTN_BLOCK]: () => {},
      [CONFIG.BTN_UNBLOCK]: () => {},
      [CONFIG.BTN_TRUST_ADD]: () => {},
      [CONFIG.BTN_TRUST_REM]: () => {},
      [CONFIG.BTN_TRANSFER]: (i) => this.transferI.onButtonInteract(i),
    };

    this.modalHandlerMap = {
      [CONFIG.MODAL_RENAME]: (i) => this.renameI.onModalInteract(i),
      [CONFIG.MODAL_SET_LIMIT]: (i) => this.limitI.onModalInteract(i),
    };

    this.inputHandlerMap = {
      [CONFIG.INP_SET_REGION]: (i) => this.regionI.onInputInteract(i),
      [CONFIG.INP_INVITE]: () => {},
      [CONFIG.INP_KICK]: () => {},
      [CONFIG.INP_BLOCK]: () => {},
      [CONFIG.INP_TRUST_ADD]: () => {},
      [CONFIG.INP_TRUST_REM]: () => {},
    };
  }

  @InVoiceHandler()
  @On('interactionCreate')
  async onInteract(interaction: Interaction) {
    if (interaction.isButton()) {
      return this.buttonHandlerMap[interaction.customId]?.(interaction);
    }

    if (interaction.isModalSubmit()) {
      return this.modalHandlerMap[interaction.customId]?.(interaction);
    }

    if (interaction.isStringSelectMenu()) {
      return this.inputHandlerMap[interaction.customId]?.(interaction);
    }
  }
}
