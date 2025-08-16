import { Injectable } from '@nestjs/common';
import { ButtonInteraction, PermissionsBitField } from 'discord.js';
import { CheckRightsService } from '../extra/checkRights.service';
import { InteractionExtractorService } from '../extra/interactionExtractor.service';
import { MESSAGES } from 'src/common/constants';

@Injectable()
export class PrivacyInteraction {
  constructor(
    private readonly checkRights: CheckRightsService,
    private readonly interactionExtractor: InteractionExtractorService,
  ) {}

  async onButtonInteract(interaction: ButtonInteraction) {
    await interaction.deferReply({ flags: 'Ephemeral' });

    const { isOwner, isTrusted } = await this.checkRights.check(interaction);

    if (!isOwner && !isTrusted) {
      await interaction.editReply(MESSAGES.NO_RIGHTS);
      return;
    }

    const { voiceChannel, guild } =
      await this.interactionExtractor.extract(interaction);

    const everyone = guild.roles.everyone;
    const currentPerms = voiceChannel.permissionsFor(everyone);

    const isPrivate = currentPerms
      ? !currentPerms.has(PermissionsBitField.Flags.Connect)
      : true;

    const newPrivacy = isPrivate ? 'public' : 'private';

    await voiceChannel.permissionOverwrites.edit(everyone, {
      Connect: isPrivate,
    });

    await interaction.editReply(
      `Канал теперь ${newPrivacy === 'public' ? '**публичный**' : '**приватный**'}.`,
    );
  }
}
