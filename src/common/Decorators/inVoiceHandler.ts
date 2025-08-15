import {
  ButtonInteraction,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
} from 'discord.js';
import { GUILD } from '../constants';

export function InVoiceHandler<
  I extends
    | ButtonInteraction
    | ModalSubmitInteraction
    | StringSelectMenuInteraction,
>() {
  return function <T extends (interaction: I, ...args: any[]) => unknown>(
    target: unknown,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>,
  ): TypedPropertyDescriptor<T> {
    if (!descriptor.value) {
      throw new Error(`Method "${propertyKey}" is undefined`);
    }

    const original = descriptor.value;

    descriptor.value = async function (
      ...args: Parameters<T>
    ): Promise<ReturnType<T> | void> {
      const interaction = args[0];

      if (interaction.isCommand()) return;

      const member = interaction.guild?.members.cache.get(interaction.user.id);
      const channel = member?.voice.channel;

      if (
        !channel ||
        channel.parent?.name !== GUILD.CHS_CATEGORY_NAME ||
        channel.name === GUILD.CH_GENERATOR_NAME
      ) {
        await interaction.reply({
          content: 'Нужно находиться в сгенерированном голосовом канале!',
          flags: 'Ephemeral',
        });
        return;
      }

      return original.apply(this, args) as ReturnType<T>;
    } as T;

    return descriptor;
  };
}
