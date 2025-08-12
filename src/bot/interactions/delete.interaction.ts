import { Injectable } from '@nestjs/common';
import { ButtonInteraction } from 'discord.js';

@Injectable()
export class DeleteChannelInteraction {
  async onButtonInteract(interaction: ButtonInteraction) {
    await interaction.deferReply({ flags: 'Ephemeral' });
    const member = interaction.guild.members.cache.get(interaction.user.id);
    const channel = member.voice.channel;
    //TODO: Требуется интеграция с БД для проверки на владельца канала
    await channel.delete();
    await interaction.editReply({
      content: `Голосовой канал **${channel.name}** удален.`,
    });
  }
}
