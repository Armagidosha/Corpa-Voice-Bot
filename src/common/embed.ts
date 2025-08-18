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
    'https://cdn.discordapp.com/attachments/504346744830820352/1407019598066221248/nepostavishprozrachnost_mami_net.png?ex=68a4949d&is=68a3431d&hm=aec7fcd5e1e27a20d3c4a30d23be5119c186e537741e2f01fb533c18aef4c0ee&',
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
    [CONFIG.BTN_CLAIM, ICONS.CLAIM, ButtonStyle.Secondary],
  ]),
  makeRow([[CONFIG.BTN_DELETE, ICONS.DELETE, ButtonStyle.Secondary]]),
];

export const sendEmbedInterface = async (
  channel: TextChannel | GuildTextBasedChannel,
) => {
  await channel.send({ embeds: [embed], components: rows });
};
