import {
  ButtonStyle,
  EmbedBuilder,
  GuildTextBasedChannel,
  TextChannel,
} from 'discord.js';
import { CONFIG, ICONS } from './constants';
import { makeRow } from './utils';

const embed = new EmbedBuilder()
  .setTitle('Настройка временного канала')
  .setColor(0xffb900)
  .setDescription('Используйте кнопки ниже чтобы управлять голосовым каналом.')
  .setImage(
    'https://cdn.discordapp.com/attachments/1148739831594242211/1381962774590132234/NEUKRAL2004.png?ex=68569ba1&is=68554a21&hm=c258a72a5a3406357054ede7d23ad573639576ea9a00338a745bbd869d947073&',
  );

const rows = [
  makeRow([
    [CONFIG.BTN_PRIVACY, ICONS.PRIVACY_CLOSE, ButtonStyle.Secondary],
    [CONFIG.BTN_RENAME, ICONS.RENAME, ButtonStyle.Secondary],
    [CONFIG.BTN_LIMIT, ICONS.LIMIT, ButtonStyle.Secondary],
    [CONFIG.BTN_REGION, ICONS.REGION, ButtonStyle.Secondary],
  ]),
  makeRow([
    [CONFIG.BTN_INVITE, ICONS.INVITE, ButtonStyle.Secondary],
    [CONFIG.BTN_KICK, ICONS.KICK, ButtonStyle.Secondary],
    [CONFIG.BTN_BLOCK, ICONS.BLOCK, ButtonStyle.Secondary],
    [CONFIG.BTN_UNBLOCK, ICONS.UNBLOCK, ButtonStyle.Secondary],
  ]),
  makeRow([
    [CONFIG.BTN_TRUST_ADD, ICONS.TRUSTED_ADD, ButtonStyle.Secondary],
    [CONFIG.BTN_TRUST_REM, ICONS.TRUSTED_REMOVE, ButtonStyle.Secondary],
    [CONFIG.BTN_TRANSFER, ICONS.TRANSFER, ButtonStyle.Secondary],
    [CONFIG.BTN_DELETE, ICONS.DELETE, ButtonStyle.Secondary],
  ]),
];

export const sendEmbedInterface = async (
  channel: TextChannel | GuildTextBasedChannel,
) => {
  await channel.send({ embeds: [embed], components: rows });
};
