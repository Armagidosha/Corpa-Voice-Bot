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

export const randomizeEmoji = (emojiArr: string[]): string | null => {
  if (emojiArr.length === 0) return null;
  return emojiArr[Math.floor(Math.random() * emojiArr.length)];
};
