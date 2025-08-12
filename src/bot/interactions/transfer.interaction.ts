import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ActionRowBuilder,
  ButtonInteraction,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  UserSelectMenuBuilder,
} from 'discord.js';
import { CONFIG } from 'src/common/constants';
import { Channel } from 'src/entities/channel.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransferInteraction {
  constructor(
    @InjectRepository(Channel) channelRepository: Repository<Channel>,
  ) {}

  async onButtonInteract(interaction: ButtonInteraction) {
    const member = interaction.guild.members.cache.get(interaction.user.id);
    const channelMembers = member.voice.channel.members;

    //TODO: Требуется интеграция с БД для проверки на владельца канала
    console.log(channelMembers.size);
    if (channelMembers.size <= 1) {
      await interaction.reply({
        content: 'Ты в канале один. Уверен, что есть кому передать права?',
        flags: 'Ephemeral',
      });
      return;
    }

    const selectOptions = channelMembers
      .filter((item) => item.displayName !== member.displayName)
      .map((item) => ({ label: item.displayName, value: item.id }));

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(CONFIG.INP_TRANSFER)
        .setPlaceholder('Выбери кому отдать все свои права')
        .addOptions(selectOptions),
    );

    await interaction.reply({
      content: 'Очень важный выбор',
      flags: 'Ephemeral',
      components: [row],
    });
  }

  async onInputInteraction(interaction: StringSelectMenuInteraction) {
    //TODO: Требуется интеграция с БД для записи новго владельца
  }
}
