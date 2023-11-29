import { exportCategories } from '@commercetools-demo/shared-code';

// const categories = [__dirname, '../../', 'fashion-store', 'typescript', 'files', 'categories.csv'];
const categories = [__dirname, '../../', 'b2c', 'typescript', 'files', 'categories.csv'];
exportCategories(
  categories,
  [
    'key',
    'externalId',
    'name_en-GB',
    'name_en-US',
    'name_de-DE',
    'description_en-GB',
    'description_en-US',
    'description_de-DE',
    'slug_en-GB',
    'slug_en-US',
    'slug_de-DE',
    'parentId',
    'orderHint',
  ],
  ['en-AU', 'ar-AE', 'en-CA', 'es-ES', 'es-MX', 'fr-CA', 'fr-FR', 'it-IT', 'ja-JP', 'nl-NL', 'pt-PT', 'zh-CN'],
).then(() => process.exit());
