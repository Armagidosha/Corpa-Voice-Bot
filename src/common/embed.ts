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
  .setDescription('Используйте кнопки ниже, чтобы управлять голосовым каналом.')
  .setImage(
    'https://cdn.discordapp.com/attachments/1148739831594242211/1406310818093731880/-1.png?ex=68a20083&is=68a0af03&hm=c5a9163e73005ce3c1e58bbe0295622b97ffb235561ab63f79aef172c0c9cb43&',
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
    [CONFIG.BTN_UNBLOCK, ICONS.UNBLOCK, ButtonStyle.Secondary],
    [CONFIG.BTN_BLOCK, ICONS.BLOCK, ButtonStyle.Secondary],
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
