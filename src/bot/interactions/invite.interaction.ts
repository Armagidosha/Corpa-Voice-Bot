import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ButtonInteraction } from 'discord.js';
import { Channel } from 'src/entities/channel.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InviteInteraction {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
  ) {}

  async onButtonInteract(interaction: ButtonInteraction) {
    //TODO: Требуется интеграция с БД для проверки на владельца канала
    const member = interaction.guild?.members.cache.get(interaction.user.id);
    const channel = member?.voice.channel;
    const channelData = this.channelRepository.find({
      where: { channelId: channel.id },
      relations: { trustedId: true },
    });

    // if (channelData)
  }
}
