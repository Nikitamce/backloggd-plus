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

const SITE_T_ATTR = 'data-blp-site-t';

/** Inject once — keep translated labels readable (no smashed glyphs). */
let styleInjected = false;
function ensureTranslateStyles() {
  if (styleInjected || typeof document === 'undefined') return;
  styleInjected = true;
  const s = document.createElement('style');
  s.id = 'blp-site-translate-style';
  s.textContent = `
/* Site translator: prevent smashed / overlapping label text */
[${SITE_T_ATTR}] {
  letter-spacing: normal !important;
  word-spacing: normal !important;
  white-space: normal !important;
  line-height: 1.25 !important;
  text-overflow: unset;
}
button[${SITE_T_ATTR}],
a.btn[${SITE_T_ATTR}],
.btn[${SITE_T_ATTR}] {
  white-space: nowrap !important;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 0.75rem !important;
  padding-right: 0.75rem !important;
}
`;
  document.documentElement.appendChild(s);
}

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
 * @param {(…args: any[]) => string} replace
 * @param {RegExpMatchArray} m
 */
function applyPatternReplace(replace, m) {
  return replace(...m);
}

/**
 * Set label text on a control while keeping decorative icons.
 * Always ends as a single clean text node (avoids smashed multi-node labels).
 * @param {HTMLElement} el
 * @param {string} next
 */
function setElementLabel(el, next) {
  const icons = [];
  for (const child of [...el.childNodes]) {
    if (child.nodeType === 1) {
      const tag = /** @type {Element} */ (child).tagName;
      if (DECOR_TAGS.has(tag) || (tag === 'SPAN' && isIconOnlySpan(/** @type {HTMLElement} */ (child)))) {
        icons.push(child);
      }
    }
  }
  while (el.firstChild) el.removeChild(el.firstChild);
  for (const icon of icons) {
    el.appendChild(icon);
    // gap between icon and label
    el.appendChild(document.createTextNode(' '));
  }
  // Use normal spaces explicitly; avoid NBSP-only runs
  el.appendChild(document.createTextNode(String(next)));
  el.setAttribute(SITE_T_ATTR, '1');
}

function isIconOnlySpan(el) {
  if (!el || el.tagName !== 'SPAN') return false;
  for (const c of el.children) {
    if (!DECOR_TAGS.has(c.tagName)) return false;
  }
  // no meaningful text of its own
  return !normalizeKey(el.textContent) || el.children.length > 0;
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
    'a, button, label, option, h1, h2, h3, h4, h5, h6, span, small, strong, em, p, li, th, td, select, summary, div.dropdown-toggle, [data-toggle="dropdown"], [data-bs-toggle="dropdown"]'
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

    setElementLabel(el, next);
  }
}

/**
 * Allow light nesting (dropdowns often wrap “Stats for all versions” + caret).
 * @param {HTMLElement} el
 */
function isSimpleLabelElement(el) {
  if (el.querySelector('div, table, ul, ol, form, input, textarea, select, iframe, video, canvas')) {
    // select itself is ok when el is select
    if (el.tagName !== 'SELECT' && el.querySelector('div, table, ul, ol, form, input, textarea, iframe')) {
      return false;
    }
  }
  if (el.childElementCount > 12) return false;
  const t = normalizeKey(el.textContent);
  if (!t || t.length > 200) return false;
  // Huge layout shells
  if (el.tagName === 'DIV' && el.childElementCount > 3 && t.length > 80) return false;
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
  // Always use regular spaces in the translated body
  textNode.nodeValue = lead + next.replace(/\u00a0/g, ' ') + trail;
  const parent = textNode.parentElement;
  if (parent && !parent.hasAttribute(SITE_T_ATTR)) {
    parent.setAttribute(SITE_T_ATTR, '1');
  }
}

/**
 * @param {string} trimmed normalized
 * @param {import('../i18n/site-ui.js').SiteUiPack | null} pack
 */
function translatePhrase(trimmed, pack) {
  if (/^undefined\s+лайк/i.test(trimmed)) {
    return '0 лайков';
  }
  // Repair previous smashed long labels if still in DOM
  if (/^Защ/i.test(trimmed) && trimmed.length < 20 && !/\s/.test(trimmed)) {
    return 'Запись';
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

  // Genre tokens only for short single words (not whole sentences)
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
      if (translated && translated !== key) {
        el.value = translated;
      }
    }
  }
}
