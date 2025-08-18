export const ICONS = {
  PRIVACY_CLOSE: { name: 'privacy', id: '1406309566307766322' },
  RENAME: { name: 'rename', id: '1406309677440041190' },
  LIMIT: { name: 'limit', id: '1406309626085113926' },
  REGION: { name: 'region', id: '1406309648373518376' },
  DELETE: { name: 'delete', id: '1406309705973760173' },
  INVITE: { name: 'invite', id: '1406309320378810368' },
  KICK: { name: 'kick', id: '1406309246903128154' },
  BLOCK: { name: 'ban', id: '1406309388226138222' },
  UNBLOCK: { name: 'unban', id: '1406309414683672576' },
  TRUSTED_ADD: { name: 'trust', id: '1406309451526438922' },
  TRUSTED_REMOVE: { name: 'untrust', id: '1406309478235770980' },
  TRANSFER: { name: 'transfer', id: '1406309356365942784' },
  CLAIM: { name: 'claim', id: '1407023438987661544' },
} as const;

export const GUILD = {
  CHS_CATEGORY_NAME: 'Голосовые каналы🔊',
  CH_GENERATOR_NAME: '➕ Создать канал',
  CH_INTERFACE_NAME: '🔐Управление каналом',
};

export const MESSAGES = {
  ALREADY_BANNED: 'Пользователь уже в бане',
  ALREADY_TRUSTED: 'Пользователь уже модератор',
  BAN_LIST_EMPTY: 'Список заблокированных пуст',
  BLOCKED_USER_NOT_FOUND: 'Пользователь не найден в бан-листе',
  CHANNEL_SHOULD_BE_PRIVATE: 'Канал должен быть приватным',
  CANT_KICK_OWNER: 'Нельзя кикнуть владельца канала',
  CANT_INVITE_USER_IN_CHANNEL: 'Пользователь уже в канале',
  IMPORTANT_CHOICE: 'Важный выбор!',
  INVALID_CHANNEL_LIMIT: 'Лимит канала — от 0 до 99 (0 = без лимита)',
  INVALID_CHANNEL_NAME: 'Название канала должно быть от 1 до 100 символов',
  MAKE_A_CHOICE: 'Сделай выбор',
  NO_DATA: 'Нет данных. Попробуй пересоздать канал',
  NO_RIGHTS: 'У тебя нет прав для этого',
  RENAME_COOLDOWN: 'Канал можно переименовывать раз в 5 минут',
  SELF_OR_BOT_SELECTED: 'Нельзя выбрать себя или бота',
  SERVER_ALONE: 'Ты один на сервере. Только ты и боты',
  VOICE_ALONE: 'В голосовом канале никого нет кроме тебя',
  TRUSTED_USER_NOT_FOUND: 'Модератор не найден',
  TRUST_LIST_EMPTY: 'Список модераторов пуст',
  USER_IS_BLOCKED: 'Пользователь в бане — модером его не сделать',
  USER_IS_TRUSTED: 'Пользователь уже модератор — забанить нельзя',
  OWNER_EXISTS: 'У канала уже есть владелец',
  OWNER_CLAIM: 'Ты стал владельцем канала',
};

export const INP_CONTENT = {
  invite_select: 'Выбери, кого пригласить',
  kick_select: 'Выбери, кого кикнуть',
  limit_input: 'Задай лимит от 0 до 99 (0 = без лимита)',
  rename_input: 'Введи новое название канала',
  transfer_select: 'Выбери, кому передать владение',
  block_select: 'Выбери, кого заблокировать',
  unblock_select: 'Выбери, кого разблокировать',
  trust_add_select: 'Выбери, кому дать модератора',
  trust_del_select: 'Выбери, у кого убрать модератора',
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
  BTN_CLAIM: 'channel_claim_rights',

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
