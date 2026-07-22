import { locale, t } from '../state.js';

/**
 * Localize GameStatus `readable_status` strings (API often returns English).
 * @param {string} status
 * @param {string} [loc]
 */
export function localizeGsReadableStatus(status, loc = locale) {
  const raw = String(status || '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
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
    // "Cracked on release" / "Cracked on Release day" variants
    if (/^cracked on release\b/i.test(raw) || /^cracked on day\s*one\b/i.test(raw)) {
      return 'Взломана в день релиза';
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
    const lower = raw.toLowerCase();
    for (const [en, ru] of Object.entries(exact)) {
      if (en.toLowerCase() === lower) return ru;
    }
  }

  return raw;
}

/**
 * Shorten GameStatus group / protection chips.
 * API often appends long English warnings after "Hypervisor" / em dash.
 * Example: "Bypass by Denuvo Hypervisor – is bypass where you generally…"
 * → "Bypass by Denuvo Hypervisor" (or RU short form).
 * @param {string} name
 * @param {string} [loc]
 */
export function localizeGsChipLabel(name, loc = locale) {
  let s = String(name || '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!s) return s;

  // Drop long disclaimer after en/em dash or "is bypass where…"
  s = s.replace(/\s*[–—−-]\s*is\s+bypass\b.*$/i, '');
  s = s.replace(/\s+is\s+bypass\s+where\b.*$/i, '');
  s = s.replace(/\s*Be careful!?\s*$/i, '');
  // Anything after "Hypervisor" that looks like a sentence
  s = s.replace(/(Hypervisor)\s*[–—−,:;-]?\s+.+$/i, '$1');
  s = s.trim();

  if (loc === 'ru') {
    // "Bypass by Denuvo Hypervisor" → short RU
    let m = s.match(/^Bypass by\s+(.+)$/i);
    if (m) return `Обход ${m[1].trim()}`;
    m = s.match(/^Bypass\s+(.+)$/i);
    if (m) return `Обход ${m[1].trim()}`;
    if (/^bypass$/i.test(s)) return 'Обход';
  }

  return s;
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
