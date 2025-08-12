import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export const makeRow = (
  rowEl: [string, { name: string; id: string } | string, ButtonStyle][],
) => {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    rowEl.map(([id, emoji, style]) =>
      new ButtonBuilder().setCustomId(id).setEmoji(emoji).setStyle(style),
    ),
  );

  return row;
};
