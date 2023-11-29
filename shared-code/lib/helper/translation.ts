import { v2 } from '@google-cloud/translate';
import JSONdb from 'simple-json-db';
import { isTranslationEnabled } from './config';

const db = new JSONdb(process.env.TRANSLATION_MEMORY_PATH || './translation-memory/translated.json');

export const translate = function (text: string, sourceLang = 'auto', targetLang: string): Promise<string> {
  if (targetLang.length > 2) {
    console.log('Unexpected targetLang: ' + targetLang);
  }
  return new Promise((resolve, reject) => {
    if (sourceLang != 'auto') {
      sourceLang = sourceLang.toUpperCase();
    }
    targetLang = targetLang.toUpperCase();
    const key = `${sourceLang}_to_${targetLang}__${text}`;
    if (db.has(key)) {
      resolve(db.get(key));
    } else if (sourceLang === targetLang) {
      resolve(text);
    } else if (isTranslationEnabled()) {
      googleTranslate(text, targetLang)
        .then((rep) => {
          setImmediate(() => {
            db.set(key, rep);
          });
          resolve(rep);
        })
        .catch(reject);
    } else {
      resolve(text);
    }
  });
};

const googleTranslate = async (textToTranslate: string, targetLanguage: string) => {
  const translate = new v2.Translate();
  const [result] = await translate.translate(textToTranslate, targetLanguage);
  return result;
};
