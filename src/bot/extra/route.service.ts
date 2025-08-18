import { On } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import {
  ButtonInteraction,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
} from 'discord.js';
import type { UserSelectMenuInteraction } from 'discord.js';
import { CONFIG, GUILD } from 'src/common/constants';
import { PrivacyInteraction } from '../interactions/privacy.interaction';
import { LimitInteraction } from '../interactions/limit.interaction';
import { InviteInteraction } from '../interactions/invite.interaction';
import { DeleteChannelInteraction } from '../interactions/delete.interaction';
import { RegionInteraction } from '../interactions/region.interaction';
import { ChannelRenameInteraction } from '../interactions/rename.interaction';
import { TransferInteraction } from '../interactions/transfer.interaction';
import { KickInteraction } from '../interactions/kick.interaction';
import { BlockInteraction } from '../interactions/block.interaction';
import { UnblockInteraction } from '../interactions/unblock.interaction';
import { TrustInteraction } from '../interactions/trust.interaction';
import { UntrustInteraction } from '../interactions/untrust.interaction';
import { ClaimInteraction } from '../interactions/claim.interaction';

type Interaction =
  | ButtonInteraction
  | ModalSubmitInteraction
  | StringSelectMenuInteraction
  | UserSelectMenuInteraction;

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

  private readonly selectHandlerMap: Record<
    string,
    (i: UserSelectMenuInteraction) => Promise<void> | void
  >;

  constructor(
    private readonly privacyI: PrivacyInteraction,
    private readonly limitI: LimitInteraction,
    private readonly inviteI: InviteInteraction,
    private readonly deleteI: DeleteChannelInteraction,
    private readonly regionI: RegionInteraction,
    private readonly renameI: ChannelRenameInteraction,
    private readonly transferI: TransferInteraction,
    private readonly kickI: KickInteraction,
    private readonly blockI: BlockInteraction,
    private readonly unblock: UnblockInteraction,
    private readonly trustI: TrustInteraction,
    private readonly untrustI: UntrustInteraction,
    private readonly claimI: ClaimInteraction,
  ) {
    this.buttonHandlerMap = {
      [CONFIG.BTN_PRIVACY]: (i) => this.privacyI.onButtonInteract(i),
      [CONFIG.BTN_RENAME]: (i) => this.renameI.onButtonInteract(i),
      [CONFIG.BTN_LIMIT]: (i) => this.limitI.onButtonInteract(i),
      [CONFIG.BTN_REGION]: (i) => this.regionI.onButtonInteract(i),
      [CONFIG.BTN_DELETE]: (i) => this.deleteI.onButtonInteract(i),
      [CONFIG.BTN_INVITE]: (i) => this.inviteI.onButtonInteract(i),
      [CONFIG.BTN_KICK]: (i) => this.kickI.onButtonInteract(i),
      [CONFIG.BTN_BLOCK]: (i) => this.blockI.onButtonInteract(i),
      [CONFIG.BTN_UNBLOCK]: (i) => this.unblock.onButtonInteract(i),
      [CONFIG.BTN_TRUST_ADD]: (i) => this.trustI.onButtonInteract(i),
      [CONFIG.BTN_TRUST_REM]: (i) => this.untrustI.onButtonInteract(i),
      [CONFIG.BTN_TRANSFER]: (i) => this.transferI.onButtonInteract(i),
      [CONFIG.BTN_CLAIM]: (i) => this.claimI.onButtonInteract(i),
    };

    this.modalHandlerMap = {
      [CONFIG.MODAL_RENAME]: (i) => this.renameI.onModalInteract(i),
      [CONFIG.MODAL_SET_LIMIT]: (i) => this.limitI.onModalInteract(i),
    };

    this.inputHandlerMap = {
      [CONFIG.INP_SET_REGION]: (i) => this.regionI.onInputInteract(i),
      [CONFIG.INP_TRANSFER]: (i) => this.transferI.onInputInteraction(i),
      [CONFIG.INP_KICK]: (i) => this.kickI.onInputInteract(i),
      [CONFIG.INP_UNBLOCK]: (i) => this.unblock.onInputInteract(i),
      [CONFIG.INP_UNTRUST]: (i) => this.untrustI.onInputInteract(i),
    };

    this.selectHandlerMap = {
      [CONFIG.INP_INVITE]: (i) => this.inviteI.onInputInteract(i),
      [CONFIG.INP_BLOCK]: (i) => this.blockI.onInputInteract(i),
      [CONFIG.INP_TRUST]: (i) => this.trustI.onInputInteract(i),
    };
  }

  public async checkInVoice(interaction: Interaction) {
    const member = interaction.guild?.members.cache.get(interaction.user.id);
    const channel = member?.voice.channel;

    if (
      !channel ||
      channel.parent?.name !== GUILD.CHS_CATEGORY_NAME ||
      channel.name === GUILD.CH_GENERATOR_NAME
    ) {
      await interaction.reply({
        content: 'Нужно быть в сгенерированном голосовом канале!',
        flags: 'Ephemeral',
      });
      return false;
    }

    return true;
  }

  @On('interactionCreate')
  async onInteract(interaction: Interaction) {
    const inVoice: boolean = await this.checkInVoice(interaction);

    if (!inVoice) return;

    if (interaction.isButton()) {
      return this.buttonHandlerMap[interaction.customId]?.(interaction);
    }

    if (interaction.isModalSubmit()) {
      return this.modalHandlerMap[interaction.customId]?.(interaction);
    }

    if (interaction.isStringSelectMenu()) {
      return this.inputHandlerMap[interaction.customId]?.(interaction);
    }

    if (interaction.isUserSelectMenu()) {
      return this.selectHandlerMap[interaction.customId]?.(interaction);
    }
  }
}
