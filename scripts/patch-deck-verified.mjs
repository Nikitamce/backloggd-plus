import fs from 'fs';

const path = 'src/i18n/translations.js';
let s = fs.readFileSync(path, 'utf8');
const marker = "unifiedRatingTitle: 'Рейтинг Plus'";
const i = s.indexOf(marker);
if (i < 0) throw new Error('ru block not found');
const needle = "deckVerified: 'Verified'";
const j = s.lastIndexOf(needle, i);
if (j < 0) throw new Error('deckVerified not found before ru unifiedRating');
const next = "deckVerified: 'Проверено'";
s = s.slice(0, j) + next + s.slice(j + needle.length);
fs.writeFileSync(path, s);
console.log('patched deckVerified at', j);
