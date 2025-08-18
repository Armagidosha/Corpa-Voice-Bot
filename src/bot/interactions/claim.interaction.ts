import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ButtonInteraction } from 'discord.js';
import { Channel } from '../entities/channel.entity';
import { Repository } from 'typeorm';
import { InteractionExtractorService } from '../extra/interactionExtractor.service';
import { MESSAGES } from 'src/common/constants';

@Injectable()
export class ClaimInteraction {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    private readonly interactionExtractor: InteractionExtractorService,
  ) {}

  async onButtonInteract(interaction: ButtonInteraction) {
    await interaction.deferReply({ flags: 'Ephemeral' });
    const { voiceChannel, userId } =
      await this.interactionExtractor.extract(interaction);
    const channelData = await this.channelRepository.findOne({
      where: { channelId: voiceChannel.id },
    });

    if (!channelData) {
      await interaction.editReply(MESSAGES.NO_DATA);
      return;
    }

    if (channelData.owner || channelData.ownerId) {
      await interaction.editReply(MESSAGES.OWNER_EXISTS);
      return;
    }

    await this.channelRepository.update(
      { channelId: voiceChannel.id },
      {
        ownerId: userId,
      },
    );
    await interaction.editReply(MESSAGES.OWNER_CLAIM);
  }
}
