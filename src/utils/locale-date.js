import { locale } from '../state.js';

/** BCP 47 tags for toLocaleDateString / Intl */
export const LOCALE_BCP47 = {
  en: 'en-US',
  ru: 'ru-RU',
  zh: 'zh-CN',
  es: 'es-ES',
  pt: 'pt-BR',
  de: 'de-DE',
  fr: 'fr-FR',
  ja: 'ja-JP',
  ko: 'ko-KR',
  pl: 'pl-PL',
};

export function dateLocaleTag(pref = locale) {
  return LOCALE_BCP47[pref] || pref || undefined;
}

/**
 * Format a Date / unix seconds for UI (short month).
 * @param {Date | number | string} input
 * @param {Intl.DateTimeFormatOptions} [opts]
 */
export function formatLocaleDate(input, opts = {}) {
  let d;
  if (input instanceof Date) d = input;
  else if (typeof input === 'number') {
    // unix seconds vs ms
    d = new Date(input < 1e12 ? input * 1000 : input);
  } else d = new Date(input);
  if (Number.isNaN(d.getTime())) return null;
  try {
    return d.toLocaleDateString(dateLocaleTag(), {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...opts,
    });
  } catch (_) {
    return d.toISOString().slice(0, 10);
  }
}

const EN_MONTHS = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

/**
 * Parse common English date phrases from Backloggd (e.g. "Feb 27, 2026").
 * @param {string} text
 * @returns {Date | null}
 */
export function parseEnglishDate(text) {
  const s = String(text || '').trim();
  if (!s) return null;

  // Feb 27, 2026 | February 27, 2026 | Feb 27 2026
  let m = s.match(
    /^(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{1,2}),?\s+(\d{4})$/i
  );
  if (m) {
    const month = EN_MONTHS[m[1].toLowerCase()];
    if (month == null) return null;
    const day = Number(m[2]);
    const year = Number(m[3]);
    const d = new Date(year, month, day);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  // 27 Feb 2026 | 27 February 2026
  m = s.match(
    /^(\d{1,2})\s+(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{4})$/i
  );
  if (m) {
    const month = EN_MONTHS[m[2].toLowerCase()];
    if (month == null) return null;
    const d = new Date(Number(m[3]), month, Number(m[1]));
    return Number.isNaN(d.getTime()) ? null : d;
  }

  // 2026-02-27
  m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) {
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return Number.isNaN(d.getTime()) ? null : d;
  }

  return null;
}

/**
 * If text is an English-formatted date, return localized form; else null.
 * @param {string} text
 * @param {string} [loc]
 */
export function localizeEnglishDateText(text, loc = locale) {
  if (!loc || loc === 'en') return null;
  const d = parseEnglishDate(text);
  if (!d) return null;
  return formatLocaleDate(d);
}
