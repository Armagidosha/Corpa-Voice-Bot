import { Injectable } from '@nestjs/common';
import { ButtonInteraction } from 'discord.js';
import { CheckRightsService } from '../extra/checkRights.service';
import { MESSAGES } from 'src/common/constants';

@Injectable()
export class DeleteChannelInteraction {
  constructor(private readonly checkRightsService: CheckRightsService) {}
  async onButtonInteract(interaction: ButtonInteraction) {
    await interaction.deferReply({ flags: 'Ephemeral' });

    const { isOwner } = await this.checkRightsService.check(interaction);

    if (!isOwner) {
      await interaction.editReply(MESSAGES.NO_RIGHTS);
      return;
    }

    const member = interaction.guild.members.cache.get(interaction.user.id);
    const channel = member.voice.channel;

    await channel.delete();
    await interaction.editReply(`Голосовой канал **${channel.name}** удален.`);
  }
}
