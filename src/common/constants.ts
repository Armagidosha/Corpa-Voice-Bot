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

export const MESSAGES = {
  ALREADY_BANNED: 'Пользователь уже находится в списке заблокированных',
  ALREADY_TRUSTED: 'Пользователь уже находится в числе модераторов',
  BAN_LIST_EMPTY: 'Твой список заблокированных пуст',
  BLOCKED_USER_NOT_FOUND: 'Пользователь не найден в списке заблокированных',
  CHANNEL_SHOULD_BE_PRIVATE: 'Канал должен быть приватным',
  CANT_KICK_OWNER: 'Ты не можешь выгнать владельца канала',
  IMPORTANT_CHOICE: 'Очень важный выбор!',
  INVALID_CHANNEL_LIMIT: 'Лимит канала должен быть от 0 до 99 (0 - без лимита)',
  INVALID_CHANNEL_NAME: 'Название канала должно быть от 1 до 100 символов',
  MAKE_A_CHOICE: 'Выбери уже что-нибудь!',
  NO_DATA: 'Данные не найдены в БД, пересоздайте канал',
  NO_RIGHTS: 'У тебя нет прав на это действие',
  RENAME_COOLDOWN:
    'Этот канал можно переименовывать не чаще, чем раз в 5 минут',
  SELF_OR_BOT_SELECTED: 'Ты не можешь выбрать себя или бота',
  SERVER_ALONE: 'Ты один на сервере. Только ты и железяки',
  VOICE_ALONE: 'В канале больше никого нет, кроме тебя',
  TRUSTED_USER_NOT_FOUND: 'Модератор не найден',
  TRUST_LIST_EMPTY: 'Твой список модераторов пуст',
  USER_IS_BLOCKED:
    'Пользователь находится в списке заблокированных, его нельзя назначить модератором',
  USER_IS_TRUSTED:
    'Пользователь находится в списке модераторов, его нельзя заблокировать',
};

export const INP_CONTENT = {
  invite_select: 'Кого хочешь пригласить',
  kick_select: 'Кого хочешь кикнуть',
  limit_input: 'Установи лимит от 0 до 99 (0 = убрать лимит)',
  rename_input: 'Новое название канала',
  transfer_select: 'Кому передать владение каналом',
  block_select: 'Кого заблокировать',
  unblock_select: 'Кого разблокировать',
  trust_add_select: 'Кому дать права модератора',
  trust_del_select: 'У кого забрать права модератора',
};

export const regionConfig = [
  {
    label: 'Передать штурвал судьбе',
    description: 'Автоматический выбор региона с низкой задержкой.',
    value: 'auto',
  },
  {
    label: 'Вротдам',
    description: 'Нидерланды, Роттердам. Наиболее оптимальный регион.',
    value: 'rotterdam',
  },
  {
    label: 'О, привет, Болливуд!',
    description:
      'Индийский регион, где пинг танцует ламбаду, а задержка приходит с приправой карри и щепоткой хаоса.',
    value: 'india',
  },
  {
    label: 'Восточная Америка',
    description:
      'Поздравляю, вы иностранный агент, живете на 10 секунд позже, зато в Америке.',
    value: 'us-west',
  },
];

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
  INP_UNBLOCK: 'input_user_unblock',
  INP_TRUST: 'input_channel_trust_add',
  INP_UNTRUST: 'input_channel_trust_remove',
  INP_TRANSFER: 'input_channel_transfer',
} as const;
