import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, '../src/locales');
const enPath = path.join(localesDir, 'en.json');
const trPath = path.join(localesDir, 'tr.json');

function loadJSON(filepath) {
  const content = fs.readFileSync(filepath, 'utf-8');
  return JSON.parse(content);
}

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function validateTranslations() {
  const en = loadJSON(enPath);
  const tr = loadJSON(trPath);

  const enKeys = getAllKeys(en);
  const trKeys = getAllKeys(tr);

  const enSet = new Set(enKeys);
  const trSet = new Set(trKeys);

  const missingInTr = enKeys.filter(key => !trSet.has(key));
  const missingInEn = trKeys.filter(key => !enSet.has(key));

  let hasErrors = false;

  if (missingInTr.length > 0) {
    console.error('\n❌ Missing in Turkish (tr.json):');
    missingInTr.forEach(key => console.error(`  - ${key}`));
    hasErrors = true;
  }

  if (missingInEn.length > 0) {
    console.error('\n❌ Extra in Turkish (not in en.json):');
    missingInEn.forEach(key => console.error(`  - ${key}`));
    hasErrors = true;
  }

  if (!hasErrors) {
    console.log('\n✅ All translations are in sync!');
    console.log(`   Total keys: ${enKeys.length}`);
  } else {
    process.exit(1);
  }
}

validateTranslations();
