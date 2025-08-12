export const ICONS = {
  PRIVACY_CLOSE: { name: 'privacy', id: '1404776519741603871' },
  RENAME: { name: 'rename', id: '1404776509507502131' },
  LIMIT: { name: 'limit', id: '1404776499936104582' },
  REGION: { name: 'region', id: '1404785192228491291' },
  DELETE: { name: 'delete', id: '1404784588898697296' },
  INVITE: { name: 'invite', id: '1404776677430525982' },
  KICK: { name: 'kick', id: '1404776575198826516' },
  BLOCK: { name: 'ban', id: '1404776780320997376' },
  UNBLOCK: { name: 'unban', id: '1404776793478795264' },
  TRUSTED_ADD: { name: 'trust', id: '1404777111121559724' },
  TRUSTED_REMOVE: { name: 'donttrust', id: '1404779602953375774' },
  TRANSFER: { name: 'transfer', id: '1404776697211129980' },
} as const;

export const GUILD = {
  CHS_CATEGORY_NAME: 'Голосовые каналы🔊',
  CH_GENERATOR_NAME: '➕ Создать канал',
  CH_INTERFACE_NAME: '🔐Управление каналом',
};

export const CONFIG = {
  BTN_PRIVACY: 'channel_toggle_privacy',
  BTN_RENAME: 'channel_rename',
  BTN_LIMIT: 'channel_set_limit',
  BTN_REGION: 'channel_set_region',
  BTN_DELETE: 'channel_delete',
  BTN_INVITE: 'user_invite',
  BTN_KICK: 'user_kick',
  BTN_BLOCK: 'user_block',
  BTN_UNBLOCK: 'user_unblock',
  BTN_TRUST_ADD: 'channel_add_trusted',
  BTN_TRUST_REM: 'channel_rem_trusted',
  BTN_TRANSFER: 'channel_transfer_rights',

  MODAL_RENAME: 'modal_channel_rename',
  MODAL_SET_LIMIT: 'modal_channel_set_limit',

  INP_RENAME: 'input_channel_rename',
  INP_SET_LIMIT: 'input_channel_set_limit',
  INP_SET_REGION: 'input_channel_set_region',
  INP_INVITE: 'input_user_invite',
  INP_KICK: 'input_user_kick',
  INP_BLOCK: 'input_user_block',
  INP_TRUST_ADD: 'input_channel_trust_add',
  INP_TRUST_REM: 'input_channel_trust_remove',
  INP_TRANSFER: 'input_channel_transfer',
} as const;
