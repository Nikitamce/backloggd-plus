/**
 * Steam store category / tag / genre display names (English API → locale).
 * Used when rendering Plus chips; incomplete maps fall back to English.
 */

/** @type {Record<string, Record<string, string>>} */
export const STEAM_CATEGORY_I18N = {
  ru: {
    'Single-player': 'Одиночная игра',
    'Single Player': 'Одиночная игра',
    'Multi-player': 'Мультиплеер',
    'Multiplayer': 'Мультиплеер',
    'Online PvP': 'Онлайн PvP',
    'Online Co-op': 'Онлайн-кооп',
    'Shared/Split Screen': 'Разделённый экран',
    'Shared/Split Screen PvP': 'PvP на разделённом экране',
    'Shared/Split Screen Co-op': 'Кооп на разделённом экране',
    'Cross-Platform Multiplayer': 'Кроссплатформенный мультиплеер',
    'Steam Achievements': 'Достижения Steam',
    'Steam Trading Cards': 'Карточки Steam',
    'Steam Cloud': 'Облако Steam',
    'Steam Workshop': 'Мастерская Steam',
    'Steam Leaderboards': 'Таблица лидеров Steam',
    'Captions available': 'Субтитры',
    'Full controller support': 'Полная поддержка геймпада',
    'Partial Controller Support': 'Частичная поддержка геймпада',
    'Partial controller support': 'Частичная поддержка геймпада',
    'Remote Play Together': 'Remote Play Together',
    'Remote Play on Phone': 'Remote Play на телефоне',
    'Remote Play on Tablet': 'Remote Play на планшете',
    'Remote Play on TV': 'Remote Play на ТВ',
    'VR Supported': 'Поддержка VR',
    'VR Only': 'Только VR',
    'Stats': 'Статистика',
    'In-App Purchases': 'Внутриигровые покупки',
    'Includes level editor': 'Редактор уровней',
    'Family Sharing': 'Семейный доступ',
    'HDR available': 'HDR',
    'DualShock Controller Support': 'Поддержка DualShock',
    'DualSense Controller Support': 'Поддержка DualSense',
    'Tracked Controller Support': 'Трекируемые контроллеры',
    'Valve Anti-Cheat enabled': 'Valve Anti-Cheat',
    'Online Co-op': 'Онлайн-кооп',
    'LAN Co-op': 'LAN-кооп',
    'LAN PvP': 'LAN PvP',
    MMO: 'MMO',
    'PvP': 'PvP',
    'Co-op': 'Кооп',
  },
};

/** Common Steam community tags */
/** @type {Record<string, Record<string, string>>} */
export const STEAM_TAG_I18N = {
  ru: {
    Action: 'Экшен',
    Adventure: 'Приключения',
    RPG: 'RPG',
    Strategy: 'Стратегия',
    Simulation: 'Симулятор',
    Indie: 'Инди',
    Casual: 'Казуальная',
    Horror: 'Хоррор',
    'Survival Horror': 'Сурвайвал-хоррор',
    Survival: 'Выживание',
    Zombies: 'Зомби',
    FPS: 'FPS',
    'Third-Person Shooter': 'Шутер от 3-го лица',
    'First-Person': 'От 1-го лица',
    'Third Person': 'От 3-го лица',
    'Action-Adventure': 'Экшен-приключения',
    Singleplayer: 'Одиночная',
    Multiplayer: 'Мультиплеер',
    'Co-op': 'Кооп',
    Atmospheric: 'Атмосфера',
    Cinematic: 'Кинематографичность',
    Realistic: 'Реализм',
    '3D': '3D',
    '2D': '2D',
    Story: 'Сюжет',
    'Story Rich': 'Насыщенный сюжет',
    Puzzle: 'Головоломка',
    Shooter: 'Шутер',
    Platformer: 'Платформер',
    Open: 'Открытый мир',
    'Open World': 'Открытый мир',
    Sci: 'Sci-Fi',
    'Sci-fi': 'Sci-Fi',
    'Science Fiction': 'Научная фантастика',
    Fantasy: 'Фэнтези',
    Dark: 'Мрачная',
    Violent: 'Жестокость',
    Gore: 'Кровь',
    Female: 'Женский протагонист',
    'Female Protagonist': 'Женский протагонист',
    Stealth: 'Стелс',
    Exploration: 'Исследование',
    Psychological: 'Психологический',
    'Psychological Horror': 'Психологический хоррор',
  },
};

/** IGDB / Backloggd genre labels on game pages */
/** @type {Record<string, Record<string, string>>} */
export const GENRE_I18N = {
  ru: {
    Adventure: 'Приключения',
    Puzzle: 'Головоломка',
    Shooter: 'Шутер',
    Action: 'Экшен',
    RPG: 'RPG',
    'Role-playing (RPG)': 'RPG',
    Strategy: 'Стратегия',
    Simulator: 'Симулятор',
    Simulation: 'Симулятор',
    Sport: 'Спорт',
    Sports: 'Спорт',
    Racing: 'Гонки',
    Fighting: 'Файтинг',
    Platform: 'Платформер',
    Platformer: 'Платформер',
    Indie: 'Инди',
    Arcade: 'Аркада',
    Card: 'Карточная',
    'Card & Board Game': 'Карточная / настольная',
    MOBA: 'MOBA',
    'Real Time Strategy (RTS)': 'RTS',
    'Turn-based strategy (TBS)': 'TBS',
    Tactical: 'Тактика',
    Quiz: 'Викторина',
    'Quiz/Trivia': 'Викторина',
    Music: 'Музыка',
    Pinball: 'Пинбол',
    'Point-and-click': 'Квест (point-and-click)',
    Visual: 'Визуальная новелла',
    'Visual Novel': 'Визуальная новелла',
    Horror: 'Хоррор',
  },
};

/**
 * @param {string} name
 * @param {string} loc
 * @param {Record<string, Record<string, string>>} table
 */
export function localizeSteamLabel(name, loc, table) {
  if (!name || !loc || loc === 'en') return name;
  const pack = table[loc];
  if (!pack) return name;
  return pack[name] || pack[String(name).trim()] || name;
}

export function localizeSteamCategory(description, loc) {
  return localizeSteamLabel(description, loc, STEAM_CATEGORY_I18N);
}

export function localizeSteamTag(name, loc) {
  return localizeSteamLabel(name, loc, STEAM_TAG_I18N);
}

export function localizeGenre(name, loc) {
  return localizeSteamLabel(name, loc, GENRE_I18N);
}
