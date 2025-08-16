import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ActionRowBuilder,
  ButtonInteraction,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
} from 'discord.js';
import { Repository } from 'typeorm';
import { CONFIG, INP_CONTENT, MESSAGES } from 'src/common/constants';
import { Channel } from 'src/bot/entities/channel.entity';
import { CheckRightsService } from '../extra/checkRights.service';
import { InteractionExtractorService } from '../extra/interactionExtractor.service';

@Injectable()
export class TransferInteraction {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    private readonly checkRights: CheckRightsService,
    private readonly interactionExtractor: InteractionExtractorService,
  ) {}

  async onButtonInteract(interaction: ButtonInteraction) {
    await interaction.deferReply({ flags: 'Ephemeral' });

    const member = interaction.guild.members.cache.get(interaction.user.id);
    const channelMembers = member.voice.channel.members;

    const { isOwner } = await this.checkRights.check(interaction);

    if (!isOwner) {
      await interaction.editReply(MESSAGES.NO_RIGHTS);
      return;
    }

    if (channelMembers.size <= 1) {
      await interaction.editReply(MESSAGES.VOICE_ALONE);
      return;
    }

    const selectOptions = channelMembers
      .filter((item) => item.displayName !== member.displayName)
      .map((item) => ({ label: item.displayName, value: item.id }));

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(CONFIG.INP_TRANSFER)
        .setPlaceholder(INP_CONTENT.transfer_select)
        .addOptions(selectOptions),
    );

    await interaction.editReply({
      content: MESSAGES.IMPORTANT_CHOICE,
      components: [row],
    });
  }

  async onInputInteraction(interaction: StringSelectMenuInteraction) {
    await interaction.deferReply({ flags: 'Ephemeral' });

    const { values, voiceChannel, userId, guild } =
      await this.interactionExtractor.extract(interaction);

    const newOwnerId = values[0];
    const newOwner = await guild.members.fetch(newOwnerId);

    const channelData = await this.channelRepository.findOne({
      where: { channelId: voiceChannel.id },
      relations: { owner: true },
    });

    if (!channelData) {
      await interaction.editReply(MESSAGES.NO_DATA);
      return;
    }

    await this.channelRepository.update(
      { channelId: voiceChannel.id },
      { ownerId: String(newOwnerId) },
    );

    let reply = `Права канала переданы <@${newOwnerId}>.`;

    try {
      await newOwner.send(
        `<@${userId}> передал вам права канала <#${channelData.channelId}>`,
      );
    } catch {
      reply += 'Но не получил уведомление в ЛС';
    }

    await interaction.editReply(reply);
  }
}
