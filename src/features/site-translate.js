import {
  CARD_ATTR,
  ENRICH_ATTR,
  SIMILAR_ATTR,
  STEAMDB_ATTR,
} from '../constants.js';
import { getSiteUiPack } from '../i18n/site-ui.js';
import { locale, settings } from '../state.js';

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

const ATTRS = ['placeholder', 'title', 'aria-label', 'alt'];

/** Plus-owned roots — do not rewrite (avoids circular import with spa.js). */
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

/** Avoid re-walking huge unchanged trees every scan when nothing SPA-changed. */
let lastRunHref = '';
let lastRunAt = 0;
const MIN_RERUN_MS = 80;

/**
 * Translate native Backloggd chrome (not Plus UI) via dictionary + light patterns.
 * Safe to call often: exact matches only, skips BLP-managed nodes and long prose.
 */
export function translateSiteUi() {
  if (!settings.translateSiteUi) return;
  const pack = getSiteUiPack(locale);
  if (!pack?.exact) return;

  const now = Date.now();
  const href = location.href;
  // Always allow first run / navigation; debounce bursty mutation scans slightly
  if (href === lastRunHref && now - lastRunAt < MIN_RERUN_MS) return;
  lastRunHref = href;
  lastRunAt = now;

  const root = document.body;
  if (!root) return;

  walkText(root, pack);
  walkAttrs(root, pack);
}

/**
 * @param {ParentNode} root
 * @param {import('../i18n/site-ui.js').SiteUiPack} pack
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
      // Skip game descriptions / long review bodies (dictionary is short UI phrases)
      const raw = node.nodeValue;
      if (!raw || !raw.trim()) return NodeFilter.FILTER_REJECT;
      if (raw.trim().length > 80) return NodeFilter.FILTER_REJECT;
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
 * @param {Text} textNode
 * @param {import('../i18n/site-ui.js').SiteUiPack} pack
 */
function applyTextNode(textNode, pack) {
  const raw = textNode.nodeValue;
  if (raw == null) return;
  const trimmed = raw.trim();
  if (!trimmed) return;

  let next = pack.exact[trimmed];
  if (!next && pack.patterns) {
    for (const { re, replace } of pack.patterns) {
      const m = trimmed.match(re);
      if (!m) continue;
      next = typeof replace === 'function' ? replace(m) : trimmed.replace(re, replace);
      break;
    }
  }
  if (!next || next === trimmed) return;

  // Preserve leading/trailing whitespace of the original text node
  const lead = raw.match(/^\s*/)?.[0] ?? '';
  const trail = raw.match(/\s*$/)?.[0] ?? '';
  textNode.nodeValue = lead + next + trail;
}

/**
 * @param {ParentNode} root
 * @param {import('../i18n/site-ui.js').SiteUiPack} pack
 */
function walkAttrs(root, pack) {
  if (!(root instanceof Element) && !(root instanceof Document) && !(root instanceof DocumentFragment)) {
    return;
  }
  const scope = root instanceof Element ? root : root.documentElement || document.body;
  if (!scope?.querySelectorAll) return;

  const els = scope.querySelectorAll(
    '[placeholder], [title], [aria-label], img[alt], input[value]'
  );
  for (const el of els) {
    if (!(el instanceof HTMLElement)) continue;
    if (isBlpManagedElement(el)) continue;
    if (el.closest?.('[contenteditable="true"]')) continue;

    for (const attr of ATTRS) {
      if (!el.hasAttribute(attr)) continue;
      const val = el.getAttribute(attr);
      if (!val) continue;
      const translated = translateString(val.trim(), pack);
      if (translated && translated !== val.trim()) {
        const lead = val.match(/^\s*/)?.[0] ?? '';
        const trail = val.match(/\s*$/)?.[0] ?? '';
        el.setAttribute(attr, lead + translated + trail);
      }
    }

    // Submit / button inputs use value= for visible label
    if (
      el instanceof HTMLInputElement &&
      (el.type === 'submit' || el.type === 'button' || el.type === 'reset') &&
      el.value
    ) {
      const translated = translateString(el.value.trim(), pack);
      if (translated && translated !== el.value.trim()) {
        el.value = translated;
      }
    }
  }
}

/**
 * @param {string} trimmed
 * @param {import('../i18n/site-ui.js').SiteUiPack} pack
 */
function translateString(trimmed, pack) {
  if (!trimmed) return null;
  if (pack.exact[trimmed]) return pack.exact[trimmed];
  if (pack.patterns) {
    for (const { re, replace } of pack.patterns) {
      const m = trimmed.match(re);
      if (!m) continue;
      return typeof replace === 'function' ? replace(m) : trimmed.replace(re, replace);
    }
  }
  return null;
}
