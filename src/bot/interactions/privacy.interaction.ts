import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ButtonInteraction,
  GuildMember,
  PermissionsBitField,
} from 'discord.js';
import { Channel } from 'src/entities/channel.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PrivacyInteraction {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
  ) {}

  async onButtonInteract(interaction: ButtonInteraction) {
    await interaction.deferReply({ flags: 'Ephemeral' });
    const everyone = interaction.guild.roles.everyone;
    const channel = (interaction.member as GuildMember).voice.channel;
    //TODO: Требуется интеграция с БД для проверки на владельца канала
    const channelData = await this.channelRepository.findOne({
      where: { channelId: channel.id },
    });

    const currentPerms = channel.permissionsFor(everyone);

    const isPrivate = currentPerms
      ? !currentPerms.has(PermissionsBitField.Flags.Connect)
      : true;

    const newPrivacy = isPrivate ? 'public' : 'private';

    await channel.permissionOverwrites.edit(everyone, {
      Connect: isPrivate,
    });

    const newState = this.channelRepository.create({
      ...channelData,
      privacy: newPrivacy,
    });
    await interaction.editReply({
      content: `Канал теперь ${newPrivacy === 'public' ? '**публичный**' : '**приватный**'}.`,
    });
    await this.channelRepository.save(newState);
  }
}
