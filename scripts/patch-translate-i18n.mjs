import fs from 'fs';

const path = 'src/i18n/translations.js';
let s = fs.readFileSync(path, 'utf8');

if (s.includes('translateSiteUi:')) {
  console.log('already patched');
  process.exit(0);
}

const inserts = {
  en: `    translateSiteUi: 'Translate Backloggd site UI',
    translateSiteUiHint: 'Replaces common English chrome on backloggd.com (nav, statuses, stats labels). Uses the interface language when a dictionary exists (currently Russian). Does not translate game titles or long reviews.',`,
  ru: `    translateSiteUi: 'Переводить интерфейс Backloggd',
    translateSiteUiHint: 'Заменяет типичный английский UI сайта (меню, статусы, подписи статистики) на язык интерфейса, если есть словарь (сейчас — русский). Названия игр и длинные рецензии не трогает.',`,
  zh: `    translateSiteUi: '翻译 Backloggd 网站界面',
    translateSiteUiHint: '替换 backloggd.com 上常见英文界面文案（导航、状态、统计标签）。仅在有对应词典时生效（目前为俄语）。不翻译游戏名或长评。',`,
  es: `    translateSiteUi: 'Traducir la interfaz de Backloggd',
    translateSiteUiHint: 'Sustituye el chrome en inglés habitual (nav, estados, etiquetas de stats). Usa el idioma de la interfaz si hay diccionario (ahora ruso). No traduce títulos ni reseñas largas.',`,
  pt: `    translateSiteUi: 'Traduzir a interface do Backloggd',
    translateSiteUiHint: 'Substitui o chrome em inglês comum (nav, status, rótulos de stats). Usa o idioma da interface se houver dicionário (agora russo). Não traduz títulos nem reviews longas.',`,
  de: `    translateSiteUi: 'Backloggd-Oberfläche übersetzen',
    translateSiteUiHint: 'Ersetzt gängige englische UI-Texte (Nav, Status, Statistik-Labels). Nutzt die Interface-Sprache, wenn ein Wörterbuch existiert (derzeit Russisch). Keine Spieletitel oder langen Reviews.',`,
  fr: `    translateSiteUi: 'Traduire l’interface Backloggd',
    translateSiteUiHint: 'Remplace le chrome anglais courant (nav, statuts, libellés stats). Utilise la langue de l’interface s’il y a un dictionnaire (russe pour l’instant). Pas les titres ni les longs avis.',`,
  ja: `    translateSiteUi: 'BackloggdサイトUIを翻訳',
    translateSiteUiHint: 'ナビ・ステータス・統計ラベルなど英語UIを置き換えます。辞書がある言語のみ（現状はロシア語）。ゲーム名や長文レビューは対象外。',`,
  ko: `    translateSiteUi: 'Backloggd 사이트 UI 번역',
    translateSiteUiHint: '내비·상태·통계 라벨 등 영어 크롬을 바꿉니다. 사전이 있는 언어만(현재 러시아어). 게임 제목·긴 리뷰는 제외.',`,
  pl: `    translateSiteUi: 'Tłumacz interfejs Backloggd',
    translateSiteUiHint: 'Zastępuje typowy angielski chrome (nav, statusy, etykiety statystyk). Używa języka interfejsu, gdy jest słownik (na razie rosyjski). Bez tytułów gier i długich recenzji.',`,
};

const order = ['en', 'ru', 'zh', 'es', 'pt', 'de', 'fr', 'ja', 'ko', 'pl'];
const re = /(uiLanguageAuto: '[^']*',)\n/g;
let i = 0;
s = s.replace(re, (match, g1) => {
  const loc = order[i++];
  if (!loc || !inserts[loc]) return match;
  return `${g1}\n${inserts[loc]}\n`;
});

if (i !== 10) {
  console.error('Expected 10 replacements, got', i);
  process.exit(1);
}

const count = (s.match(/translateSiteUi:/g) || []).length;
if (count !== 10) {
  console.error('Expected 10 translateSiteUi keys, got', count);
  process.exit(1);
}

fs.writeFileSync(path, s);
console.log('patched', count, 'locales');
