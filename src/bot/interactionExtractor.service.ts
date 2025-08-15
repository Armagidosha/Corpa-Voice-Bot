import { Injectable } from '@nestjs/common';
import {
  BaseInteraction,
  Collection,
  Guild,
  GuildMember,
  User,
  VoiceBasedChannel,
} from 'discord.js';

interface ExtractedInteractionData {
  userId?: string;
  user?: User;
  guild?: Guild;
  guildMembers?: Collection<string, GuildMember>;
  member?: GuildMember;
  voiceChannel?: VoiceBasedChannel | null;
  values?: string[];
  fields?: string[];
}

@Injectable()
export class InteractionExtractorService {
  async extract(interaction: BaseInteraction) {
    const result: ExtractedInteractionData = {};

    if ('user' in interaction) {
      result.userId = interaction.user.id;
      result.user = interaction.user;
    }

    if ('guild' in interaction) {
      result.guild = interaction.guild;
      result.guildMembers = await interaction.guild.members.fetch();
    }

    const member = (interaction.member as GuildMember) || null;
    if (member) {
      result.member = member;
      result.voiceChannel = member.voice?.channel || null;
    }

    if (
      interaction.isStringSelectMenu?.() ||
      interaction.isUserSelectMenu?.()
    ) {
      result.values = interaction.values;
    }

    if (interaction.isModalSubmit?.()) {
      const fields = interaction.fields.fields;
      result.fields = fields.map((field) => field.value);
    }

    return result;
  }
}
