import { Command, Handler } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import {
  CategoryChannel,
  ChannelType,
  ChatInputCommandInteraction,
} from 'discord.js';
import { GUILD } from 'src/common/constants';
import { sendEmbedInterface } from 'src/common/embed';

@Command({
  name: 'setup',
  description: 'Инициализировать бота',
})
@Injectable()
export class SetupCommand {
  @Handler()
  async OnInteract(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({
      flags: 'Ephemeral',
    });
    const guild = interaction.guild;
    if (!guild) {
      await interaction.editReply({
        content: 'Эта команда доступна только на сервере!',
      });
      return;
    }

    if (!interaction.memberPermissions?.has('Administrator')) {
      await interaction.editReply({
        content: 'У вас нет прав администратора.',
      });
      return;
    }

    const channel = interaction.channel;
    const parentCategory =
      channel?.parent instanceof CategoryChannel ? channel.parent : null;

    let category = parentCategory;

    if (!category || category.name !== GUILD.CHS_CATEGORY_NAME) {
      category = await guild.channels.create({
        name: GUILD.CHS_CATEGORY_NAME,
        type: ChannelType.GuildCategory,
      });
    }

    const targetName = GUILD.CH_INTERFACE_NAME.replace(' ', '-').toLowerCase();

    const existing = guild.channels.cache.find(
      (ch) => ch.parentId === category.id && ch.name === targetName,
    );

    if (!existing) {
      const interfaceChannel = await guild.channels.create({
        name: GUILD.CH_INTERFACE_NAME,
        type: ChannelType.GuildText,
        parent: category,
        position: 1,
      });

      await sendEmbedInterface(interfaceChannel);
    }

    const existingGenerator = guild.channels.cache.find(
      (ch) =>
        ch.name === GUILD.CH_GENERATOR_NAME && ch.parentId === category.id,
    );

    if (!existingGenerator) {
      await guild.channels.create({
        name: GUILD.CH_GENERATOR_NAME,
        type: ChannelType.GuildVoice,
        parent: category,
        position: 2,
      });
    }

    await interaction.editReply({
      content: 'Настройка бота прошла успешно!',
    });
  }
}
