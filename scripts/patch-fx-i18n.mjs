import fs from 'fs';

const path = 'src/i18n/translations.js';
let s = fs.readFileSync(path, 'utf8');
if (s.includes('showPriceConvert:')) {
  console.log('already patched');
  process.exit(0);
}

const en = `    showPriceConvert: 'Show converted price',
    showPriceConvertHint: 'After the Steam store price, show an approximate amount in another currency (mid-market FX). Example: 1 400 ₸ ~ €2.6. On sale, smaller strikethrough is pre-discount convert.',
    convertCurrency: 'Convert prices to',
    convertCurrencyHint: 'Used only when converted price is on and store currency differs from the target.',`;

const ru = `    showPriceConvert: 'Показывать цену в другой валюте',
    showPriceConvertHint: 'После цены Steam — приблизительная сумма в выбранной валюте (рыночный курс). Пример: 1 400 ₸ ~ €2,6. При скидке справа мелко зачёркнута цена без скидки.',
    convertCurrency: 'Переводить цены в',
    convertCurrencyHint: 'Только если включён перевод и валюта магазина отличается от выбранной.',`;

const order = ['en', 'ru', 'zh', 'es', 'pt', 'de', 'fr', 'ja', 'ko', 'pl'];
const re = /(steamCountryHint: '[^']*',)\n/g;
let i = 0;
s = s.replace(re, (match, g1) => {
  const loc = order[i++];
  const block = loc === 'ru' ? ru : en;
  return `${g1}\n${block}\n`;
});

if (i !== 10) {
  console.error('Expected 10 locales, got', i);
  process.exit(1);
}

fs.writeFileSync(path, s);
console.log('patched', (s.match(/showPriceConvert:/g) || []).length);
