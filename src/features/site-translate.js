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

/** Decorative children allowed inside a “simple” control (icon + label). */
const DECOR_TAGS = new Set(['I', 'SVG', 'IMG', 'BR', 'PATH', 'USE', 'SPAN']);

/** Plus-owned roots — do not rewrite native walker (categories/tags localized at render). */
const BLP_SKIP_SEL = [
  `[${ENRICH_ATTR}]`,
  `[${STEAMDB_ATTR}]`,
  `[${SIMILAR_ATTR}]`,
  `[${CARD_ATTR}]`,
  '.blp-card-badges',
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
  '#blp-nav-settings',
  '#blp-toast-host',
  '[data-blp-debug]',
].join(', ');

function isBlpManagedElement(el) {
  if (!el || el.nodeType !== 1) return false;
  if (el.matches?.(BLP_SKIP_SEL)) return true;
  return Boolean(el.closest?.(BLP_SKIP_SEL));
}

function normalizeKey(s) {
  return String(s || '')
    .replace(/\u00a0/g, ' ')
    .replace(/[\u200b\u200c\u200d\ufeff]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Apply pack.patterns replace correctly.
 * Handlers are written like String.replace callbacks: (match, g1, g2, …) => …
 * We must spread RegExpMatchArray, not pass the array as a single arg
 * (that produced "undefined лайков").
 * @param {(…args: any[]) => string} replace
 * @param {RegExpMatchArray} m
 */
function applyPatternReplace(replace, m) {
  return replace(...m);
}

/**
 * Translate native Backloggd chrome (not Plus UI) via dictionary + dates + light patterns.
 */
export function translateSiteUi() {
  if (!settings.translateSiteUi) return;
  if (locale === 'en') return;

  const pack = getSiteUiPack(locale);
  const root = document.body;
  if (!root) return;

  // Compound labels first (icon+text buttons, split “Stats for all versions”)
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
 * Elements that only contain text + decorative icons (buttons, tabs, links).
 * Handles cases where the visible phrase is split across nodes or includes a caret.
 * @param {ParentNode} root
 * @param {import('../i18n/site-ui.js').SiteUiPack | null} pack
 */
function walkSimpleElements(root, pack) {
  if (!(root instanceof Element) && !(root instanceof Document) && !(root instanceof DocumentFragment)) {
    return;
  }
  const scope = root instanceof Element ? root : document.body;
  if (!scope?.querySelectorAll) return;

  // Prefer real controls/labels — avoid scanning huge layout divs
  const els = scope.querySelectorAll(
    'a, button, label, option, h1, h2, h3, h4, h5, h6, span, small, strong, em, p, li, th, td, select, summary'
  );

  for (const el of els) {
    if (!(el instanceof HTMLElement)) continue;
    if (isBlpManagedElement(el)) continue;
    if (el.closest?.('[contenteditable="true"]')) continue;
    if (!isSimpleLabelElement(el)) continue;

    const full = normalizeKey(el.textContent);
    if (!full || full.length > 200) continue;

    const next = translatePhrase(full, pack);
    if (!next || next === full) continue;

    // Preserve leading icon nodes; rewrite only text nodes
    const textNodes = [];
    const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    let tn = tw.nextNode();
    while (tn) {
      if (normalizeKey(tn.nodeValue)) textNodes.push(/** @type {Text} */ (tn));
      tn = tw.nextNode();
    }
    if (!textNodes.length) continue;

    if (textNodes.length === 1) {
      const raw = textNodes[0].nodeValue || '';
      const lead = raw.match(/^\s*/)?.[0] ?? '';
      const trail = raw.match(/\s*$/)?.[0] ?? '';
      textNodes[0].nodeValue = lead + next + trail;
    } else {
      // Put full translation on first text node; clear the rest (avoid "Stats"+"for all" partials)
      const raw0 = textNodes[0].nodeValue || '';
      const lead = raw0.match(/^\s*/)?.[0] ?? '';
      textNodes[0].nodeValue = lead + next;
      for (let i = 1; i < textNodes.length; i++) {
        textNodes[i].nodeValue = '';
      }
    }
  }
}

/**
 * True if element has no “heavy” nested structure (only text + icons).
 * @param {HTMLElement} el
 */
function isSimpleLabelElement(el) {
  if (el.childElementCount === 0) return true;
  for (const child of el.children) {
    const tag = child.tagName;
    if (DECOR_TAGS.has(tag)) {
      // allow nested icon spans with only decorative content
      if (tag === 'SPAN' && child.childElementCount > 0) {
        for (const nested of child.children) {
          if (!DECOR_TAGS.has(nested.tagName)) return false;
        }
      }
      continue;
    }
    return false;
  }
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

  const next = translatePhrase(trimmed, pack);
  if (!next || next === trimmed) return;

  const lead = raw.match(/^\s*/)?.[0] ?? '';
  const trail = raw.match(/\s*$/)?.[0] ?? '';
  textNode.nodeValue = lead + next + trail;
}

/**
 * @param {string} trimmed normalized
 * @param {import('../i18n/site-ui.js').SiteUiPack | null} pack
 */
function translatePhrase(trimmed, pack) {
  // Fix already-broken "undefined лайков" from older builds if still in DOM
  if (/^undefined\s+лайк/i.test(trimmed)) {
    return '0 лайков';
  }

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

  if (trimmed.length <= 40 && !/\d/.test(trimmed)) {
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
      if (translated && translated !== key) {
        el.value = translated;
      }
    }
  }
}
