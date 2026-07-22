import {
  CARD_ATTR,
  ENRICH_ATTR,
  SIMILAR_ATTR,
  STEAMDB_ATTR,
} from '../constants.js';
import { getSiteUiPack } from '../i18n/site-ui.js';
import { localizeGenre } from '../i18n/steam-labels.js';
import { locale, settings } from '../state.js';
import { localizeEnglishDateText } from '../utils/locale-date.js';

const SKIP_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'NOSCRIPT',
  'TEXTAREA',
  'CODE',
  'PRE',
  'KBD',
  'SAMP',
  'SVG',
  'MATH',
  'IFRAME',
  'OBJECT',
  'EMBED',
  'CANVAS',
]);

const ATTRS = [
  'placeholder',
  'title',
  'aria-label',
  'alt',
  'data-original-title',
  'data-bs-original-title',
  'data-bs-title',
];

const DECOR_TAGS = new Set(['I', 'SVG', 'IMG', 'BR', 'PATH', 'USE']);

/** Tags we may rewrite as a whole label (never layout shells / groups). */
const LABEL_TAGS = new Set([
  'A',
  'BUTTON',
  'LABEL',
  'OPTION',
  'SUMMARY',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'SPAN',
  'SMALL',
  'STRONG',
  'EM',
  'P',
  'LI',
  'TD',
  'TH',
]);

const BLP_SKIP_SEL = [
  `[${ENRICH_ATTR}]`,
  `[${STEAMDB_ATTR}]`,
  `[${SIMILAR_ATTR}]`,
  `[${CARD_ATTR}]`,
  '[data-blp-values]',
  '[data-blp-card]',
  '[data-blp-card-state]',
  '.blp-price',
  '.blp-price__was',
  '.blp-price__now',
  '.blp-price__stack',
  '.blp-discount',
  '.blp-discount-ends',
  '.blp-card-badges',
  '.blp-card-badge',
  '.blp-settings-backdrop',
  '.blp-fix-match-backdrop',
  '.blp-export-backdrop',
  '.blp-export-wrap',
  '.blp-export-log-wrap',
  '.blp-debug-panel',
  '.blp-steam-gallery',
  '.blp-similar',
  '.blp-viewer',
  '.blp-toast-host',
  '.blp-toast',
  '.blp-unified',
  '.blp-gs-chip',
  '.blp-steam-categories',
  '.blp-steam-tags',
  '.blp-steam-line',
  '.blp-owned-badge',
  '.blp-wishlist-badge',
  '#blp-nav-settings',
  '#blp-toast-host',
  '[data-blp-debug]',
].join(', ');

const SITE_T_ATTR = 'data-blp-site-t';

let styleInjected = false;
function ensureTranslateStyles() {
  if (typeof document === 'undefined') return;
  // Always refresh rules (older builds injected overflow:hidden that clipped UI)
  const existing = document.getElementById('blp-site-translate-style');
  if (existing) existing.remove();
  styleInjected = true;
  const s = document.createElement('style');
  s.id = 'blp-site-translate-style';
  s.textContent = `
/* Site translator — never touch Plus price chrome */
[${SITE_T_ATTR}] {
  letter-spacing: normal !important;
  word-spacing: 0.02em !important;
}
[data-blp-enrich] .blp-price,
[data-blp-enrich] .blp-price:link,
[data-blp-enrich] .blp-price:visited,
[data-blp-enrich] .blp-price:hover {
  text-decoration: none !important;
}
[data-blp-enrich] .blp-price__now {
  text-decoration: none !important;
  color: #beee11 !important;
  font-weight: 700 !important;
}
[data-blp-enrich] .blp-price:not(.blp-price--sale) {
  text-decoration: none !important;
  font-weight: 700;
}
[data-blp-enrich] .blp-price__was {
  text-decoration: line-through !important;
}
`;
  document.documentElement.appendChild(s);
}

function isBlpManagedElement(el) {
  if (!el || el.nodeType !== 1) return false;
  if (typeof el.className === 'string' && /\bblp-/.test(el.className)) return true;
  if (el.matches?.(BLP_SKIP_SEL)) return true;
  if (el.closest?.(BLP_SKIP_SEL)) return true;
  // Any Plus data-* marker in ancestors
  if (el.closest?.('[class*="blp-"], [data-blp-enrich], [data-blp-values], [data-blp-card]')) {
    return true;
  }
  return false;
}

/** Prices / percents / pure numbers — never dictionary-translate. */
function looksLikePriceOrNumber(text) {
  const s = String(text || '').trim();
  if (!s) return false;
  if (/[€$£₽₸¥₩]/.test(s)) return true;
  if (/\d/.test(s) && /(?:KZT|USD|RUB|EUR|тенге|руб)/i.test(s)) return true;
  if (/^-?\d+%$/.test(s)) return true;
  if (/^\d[\d\s.,]*$/.test(s)) return true;
  return false;
}

function normalizeKey(s) {
  return String(s || '')
    .replace(/\u00a0/g, ' ')
    .replace(/[\u200b\u200c\u200d\ufeff]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * @param {(…args: any[]) => string} replace
 * @param {RegExpMatchArray} m
 */
function applyPatternReplace(replace, m) {
  return replace(...m);
}

function isDecorNode(node) {
  if (!node || node.nodeType !== 1) return false;
  const el = /** @type {Element} */ (node);
  if (DECOR_TAGS.has(el.tagName)) return true;
  if (el.tagName === 'SPAN') {
    // empty wrapper or icon-only
    if (!el.children.length && !normalizeKey(el.textContent)) return true;
    for (const c of el.children) {
      if (!DECOR_TAGS.has(c.tagName)) return false;
    }
    return el.children.length > 0;
  }
  return false;
}

/**
 * Rewrite label text without destroying sibling controls.
 * Prefer mutating text nodes; never flatten a group of buttons.
 * @param {HTMLElement} el
 * @param {string} next
 */
function setElementLabel(el, next) {
  const textNodes = [];
  const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
  let tn = tw.nextNode();
  while (tn) {
    if (normalizeKey(tn.nodeValue)) textNodes.push(/** @type {Text} */ (tn));
    tn = tw.nextNode();
  }

  if (textNodes.length === 1) {
    const raw = textNodes[0].nodeValue || '';
    const lead = raw.match(/^\s*/)?.[0] ?? '';
    const trail = raw.match(/\s*$/)?.[0] ?? '';
    textNodes[0].nodeValue = lead + next + trail;
    el.setAttribute(SITE_T_ATTR, '1');
    return;
  }

  if (textNodes.length > 1) {
    // One control, split text ("Log" + " or review") — put full phrase on first, clear rest
    const raw0 = textNodes[0].nodeValue || '';
    const lead = raw0.match(/^\s*/)?.[0] ?? '';
    textNodes[0].nodeValue = lead + next;
    for (let i = 1; i < textNodes.length; i++) textNodes[i].nodeValue = '';
    el.setAttribute(SITE_T_ATTR, '1');
    return;
  }

  // No text nodes but has icons only — append label after icons
  const onlyDecor = [...el.childNodes].every(
    (n) => n.nodeType !== 1 || isDecorNode(n) || (n.nodeType === 3 && !normalizeKey(n.nodeValue))
  );
  if (onlyDecor) {
    el.appendChild(document.createTextNode(next));
    el.setAttribute(SITE_T_ATTR, '1');
  }
}

export function translateSiteUi() {
  if (!settings.translateSiteUi) return;
  if (locale === 'en') return;

  ensureTranslateStyles();
  const pack = getSiteUiPack(locale);
  const root = document.body;
  if (!root) return;

  walkSimpleElements(root, pack);
  walkText(root, pack);
  walkAttrs(root, pack);
}

/**
 * @param {ParentNode} root
 * @param {import('../i18n/site-ui.js').SiteUiPack | null} pack
 */
function walkText(root, pack) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if (parent.closest?.('script, style, noscript, textarea, code, pre, [contenteditable="true"]')) {
        return NodeFilter.FILTER_REJECT;
      }
      if (isBlpManagedElement(parent)) return NodeFilter.FILTER_REJECT;
      const raw = node.nodeValue;
      if (!raw || !normalizeKey(raw)) return NodeFilter.FILTER_REJECT;
      if (normalizeKey(raw).length > 200) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  /** @type {Text[]} */
  const nodes = [];
  let n = walker.nextNode();
  while (n) {
    nodes.push(/** @type {Text} */ (n));
    n = walker.nextNode();
  }

  for (const textNode of nodes) {
    applyTextNode(textNode, pack);
  }
}

/**
 * Only translate leaf-ish controls — never a parent of several status buttons.
 * @param {ParentNode} root
 * @param {import('../i18n/site-ui.js').SiteUiPack | null} pack
 */
function walkSimpleElements(root, pack) {
  if (!(root instanceof Element) && !(root instanceof Document) && !(root instanceof DocumentFragment)) {
    return;
  }
  const scope = root instanceof Element ? root : document.body;
  if (!scope?.querySelectorAll) return;

  const els = scope.querySelectorAll(
    'a, button, label, option, summary, h1, h2, h3, h4, h5, h6, span, small, strong, em, p, li'
  );

  for (const el of els) {
    if (!(el instanceof HTMLElement)) continue;
    if (!LABEL_TAGS.has(el.tagName)) continue;
    if (isBlpManagedElement(el)) continue;
    if (el.closest?.('[contenteditable="true"]')) continue;
    if (!isSafeLabelTarget(el)) continue;

    const full = normalizeKey(el.textContent);
    if (!full || full.length > 120) continue;

    // Skip concatenated multi-status strings (smashed parent)
    if (looksLikeMergedStatuses(full)) continue;

    const next = translatePhrase(full, pack);
    if (!next || next === full) continue;

    setElementLabel(el, next);
  }
}

/**
 * Detect accidental join of Played/Playing/Backlog/Wishlist labels.
 * @param {string} full
 */
function looksLikeMergedStatuses(full) {
  const hits = [
    /пройден/i,
    /играю/i,
    /бэклог/i,
    /вишлист/i,
    /played/i,
    /playing/i,
    /backlog/i,
    /wishlist/i,
  ].filter((re) => re.test(full));
  if (hits.length >= 2 && !/\s/.test(full.replace(/\s/g, ' ').trim() === full ? ' ' : '')) {
    // no spaces but multiple status words
  }
  // "ПройденоИграю" or "ройдеИграюБэклог"
  if (hits.length >= 2 && !/\s{1,}/.test(full)) return true;
  if (/(пройден|played).{0,3}(играю|playing)/i.test(full.replace(/\s/g, ''))) return true;
  if (/(играю|playing).{0,3}(бэклог|backlog)/i.test(full.replace(/\s/g, ''))) return true;
  return false;
}

/**
 * Safe: one control, no nested buttons/links (except self), only icons + text.
 * Never flatten multi-span price stacks (that broke Steam price display).
 * @param {HTMLElement} el
 */
function isSafeLabelTarget(el) {
  if (isBlpManagedElement(el)) return false;
  if (typeof el.className === 'string' && /\bblp-/.test(el.className)) return false;

  // Never touch a container that holds multiple actions
  const nestedInteractive = el.querySelectorAll('a, button, input, select, textarea');
  if (el.matches('a, button')) {
    if (el.querySelector('a, button')) return false;
    // Price / external enrich links
    if (el.classList?.contains('blp-price') || el.classList?.contains('blp-ext-link')) return false;
  } else if (nestedInteractive.length > 0) {
    return false;
  }

  if (el.childElementCount > 4) return false;

  // At most one non-decorative child (single optional <span> wrapper)
  const nonDecor = [...el.children].filter((c) => !isDecorNode(c));
  if (nonDecor.length > 1) return false;
  if (nonDecor.length === 1) {
    const only = nonDecor[0];
    if (only.tagName !== 'SPAN') return false;
    // Nested spans = price stack / compound UI — do not rewrite as one label
    if (only.children.length > 0) return false;
  }

  const t = normalizeKey(el.textContent);
  if (!t || t.length > 120) return false;
  if (looksLikePriceOrNumber(t)) return false;
  return true;
}

/**
 * @param {Text} textNode
 * @param {import('../i18n/site-ui.js').SiteUiPack | null} pack
 */
function applyTextNode(textNode, pack) {
  const raw = textNode.nodeValue;
  if (raw == null) return;
  const trimmed = normalizeKey(raw);
  if (!trimmed) return;
  if (looksLikeMergedStatuses(trimmed)) return;

  const next = translatePhrase(trimmed, pack);
  if (!next || next === trimmed) return;

  const lead = raw.match(/^\s*/)?.[0] ?? '';
  const trail = raw.match(/\s*$/)?.[0] ?? '';
  textNode.nodeValue = lead + next.replace(/\u00a0/g, ' ') + trail;
  textNode.parentElement?.setAttribute?.(SITE_T_ATTR, '1');
}

/**
 * @param {string} trimmed normalized
 * @param {import('../i18n/site-ui.js').SiteUiPack | null} pack
 */
function translatePhrase(trimmed, pack) {
  if (/^undefined\s+лайк/i.test(trimmed)) return '0 лайков';

  // Never rewrite prices / pure numbers (broke Steam tenge display)
  if (looksLikePriceOrNumber(trimmed)) return null;

  // Repair known smashed sidebar labels if still present as one blob
  if (looksLikeMergedStatuses(trimmed)) return null;

  const asDate = localizeEnglishDateText(trimmed, locale);
  if (asDate) return asDate;

  const releaseDate = trimmed.match(/^(Релиз|Released)\s+(.+)$/i);
  if (releaseDate) {
    const d = localizeEnglishDateText(releaseDate[2], locale);
    if (d) return `Релиз ${d}`;
  }

  if (!pack) return null;

  if (pack.exact[trimmed]) return pack.exact[trimmed];
  for (const [en, ru] of Object.entries(pack.exact)) {
    if (normalizeKey(en) === trimmed) return ru;
  }

  if (pack.patterns) {
    for (const { re, replace } of pack.patterns) {
      const m = trimmed.match(re);
      if (!m) continue;
      if (typeof replace === 'function') return applyPatternReplace(replace, m);
      return trimmed.replace(re, replace);
    }
  }

  if (trimmed.length <= 24 && !/\s/.test(trimmed) && !/\d/.test(trimmed)) {
    const g = localizeGenre(trimmed, locale);
    if (g !== trimmed) return g;
  }

  return null;
}

/**
 * @param {ParentNode} root
 * @param {import('../i18n/site-ui.js').SiteUiPack | null} pack
 */
function walkAttrs(root, pack) {
  if (!(root instanceof Element) && !(root instanceof Document) && !(root instanceof DocumentFragment)) {
    return;
  }
  const scope = root instanceof Element ? root : root.documentElement || document.body;
  if (!scope?.querySelectorAll) return;

  const els = scope.querySelectorAll(
    '[placeholder], [title], [aria-label], img[alt], input[value], [data-original-title], [data-bs-original-title], [data-bs-title]'
  );
  for (const el of els) {
    if (!(el instanceof HTMLElement)) continue;
    if (isBlpManagedElement(el)) continue;
    if (el.closest?.('[contenteditable="true"]')) continue;

    for (const attr of ATTRS) {
      if (!el.hasAttribute(attr)) continue;
      const val = el.getAttribute(attr);
      if (!val) continue;
      const key = normalizeKey(val);
      const translated = translatePhrase(key, pack);
      if (translated && translated !== key) {
        const lead = val.match(/^\s*/)?.[0] ?? '';
        const trail = val.match(/\s*$/)?.[0] ?? '';
        el.setAttribute(attr, lead + translated + trail);
      }
    }

    if (
      el instanceof HTMLInputElement &&
      (el.type === 'submit' || el.type === 'button' || el.type === 'reset') &&
      el.value
    ) {
      const key = normalizeKey(el.value);
      const translated = translatePhrase(key, pack);
      if (translated && translated !== key) el.value = translated;
    }
  }
}
