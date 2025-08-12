import { Command, Handler } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { ChatInputCommandInteraction } from 'discord.js';
import { sendEmbedInterface } from 'src/common/embed';

@Command({
  name: 'interface',
  description: 'Создать новый интерфейс',
})
@Injectable()
export class InterfaceCommand {
  @Handler()
  async onInteract(interaction: ChatInputCommandInteraction) {
    //TODO: Требуется интеграция с БД для проверки на владельца канала
    await interaction.deferReply({ flags: 'Ephemeral' });
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
    await sendEmbedInterface(interaction.channel);
    await interaction.editReply({ content: 'Интерфейс успешно создан' });
  }
}
