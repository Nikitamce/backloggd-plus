import { locale, t } from '../state.js';

/**
 * Localize GameStatus `readable_status` strings (API often returns English).
 * @param {string} status
 * @param {string} [loc]
 */
export function localizeGsReadableStatus(status, loc = locale) {
  const raw = String(status || '').trim();
  if (!raw) return raw;
  if (!loc || loc === 'en') return raw;

  if (loc === 'ru') {
    let m = raw.match(/^Cracked in (\d+)\s*day\(s\)$/i);
    if (m) {
      const n = Number(m[1]);
      return `Взломана за ${n} ${ruDays(n)}`;
    }
    m = raw.match(/^Cracked (\d+)\s*day\(s\)\s*ago$/i);
    if (m) {
      const n = Number(m[1]);
      return `Взломана ${n} ${ruDays(n)} назад`;
    }
    m = raw.match(/^Uncracked for (\d+)\s*day\(s\)$/i);
    if (m) {
      const n = Number(m[1]);
      return `Не взломана ${n} ${ruDays(n)}`;
    }
    const exact = {
      'Not cracked': 'Не взломана',
      Uncracked: 'Не взломана',
      Cracked: 'Взломана',
      'Cracked on release': 'Взломана в день релиза',
      'Cracked on day one': 'Взломана в день релиза',
      'Release today': 'Релиз сегодня',
      'Coming soon': 'Скоро',
      'Not released': 'Не вышла',
      Unknown: 'Неизвестно',
      Bypass: 'Обход',
      'Native linux': 'Нативный Linux',
    };
    if (exact[raw]) return exact[raw];
    // case-insensitive exact
    const lower = raw.toLowerCase();
    for (const [en, ru] of Object.entries(exact)) {
      if (en.toLowerCase() === lower) return ru;
    }
  }

  return raw;
}

function ruDays(n) {
  const k = Math.abs(n) % 100;
  const k1 = k % 10;
  if (k > 10 && k < 20) return 'дней';
  if (k1 === 1) return 'день';
  if (k1 >= 2 && k1 <= 4) return 'дня';
  return 'дней';
}

/**
 * Prefer localized readable_status; fall back to typed labels.
 * @param {object | null} game
 * @param {string} type
 */
export function resolveGsStatusLabel(game, type) {
  if (!game) return t.gsNotInDatabase;
  if (game.readable_status) {
    return localizeGsReadableStatus(game.readable_status);
  }
  if (type === 'ready') return t.gsReady;
  if (type === 'pending-recent' || type === 'pending-old') return t.gsPending;
  if (type === 'partial') return t.gsPartial;
  if (type === 'release-today') return t.gsReleaseToday;
  return t.gsUnknown;
}
