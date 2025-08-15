import { Injectable } from '@nestjs/common';
import {
  ActionRowBuilder,
  ButtonInteraction,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
} from 'discord.js';
import { CONFIG, MESSAGES } from 'src/common/constants';
import { CheckRightsService } from '../checkRights.service';
import { InteractionExtractorService } from '../interactionExtractor.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../entities/channel.entity';

@Injectable()
export class KickInteraction {
  constructor(
    private readonly checkRightsService: CheckRightsService,
    private readonly interactionExtractor: InteractionExtractorService,
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
  ) {}

  async onButtonInteract(interaction: ButtonInteraction) {
    await interaction.deferReply({ flags: 'Ephemeral' });

    const { isOwner, isTrusted } =
      await this.checkRightsService.check(interaction);

    if (!isOwner && !isTrusted) {
      await interaction.editReply(MESSAGES.NO_RIGHTS);
      return;
    }

    const { voiceChannel, userId } =
      await this.interactionExtractor.extract(interaction);

    const selectOptions = voiceChannel.members
      .filter((memb) => !memb.user.bot)
      .filter((memb) => memb.id !== userId)
      .map((memb) => ({ label: memb.displayName, value: memb.id }));

    if (!selectOptions.length) {
      await interaction.editReply(MESSAGES.VOICE_ALONE);
      return;
    }

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(CONFIG.INP_KICK)
        .setPlaceholder('Выбери, кого хочешь кикнуть')
        .addOptions(selectOptions),
    );

    await interaction.editReply({
      content: MESSAGES.IMPORTANT_CHOICE,
      components: [row],
    });
  }

  async onInputInteract(interaction: StringSelectMenuInteraction) {
    await interaction.deferReply({ flags: 'Ephemeral' });

    const { guild, voiceChannel, values } =
      await this.interactionExtractor.extract(interaction);

    const members = guild.members;

    const selectedUserId = values[0];
    const kickedUser = await members.fetch(selectedUserId);

    const channel = await this.channelRepository.findOne({
      where: { channelId: voiceChannel.id },
    });

    if (channel.ownerId === selectedUserId) {
      await interaction.editReply(MESSAGES.CANT_KICK_OWNER);
      return;
    }

    if (voiceChannel.members.has(kickedUser.id)) {
      await kickedUser.voice.disconnect();
    }

    let reply = `<@${kickedUser.id}> кикнут из канала.`;

    try {
      await kickedUser.send(
        `Ты был кикнут из голосового канала <#${voiceChannel.id}> пользователем <@${interaction.user.id}>.`,
      );
    } catch {
      reply += ' Но он не получил уведомление в ЛС.';
    }

    await interaction.editReply(reply);
  }
}
