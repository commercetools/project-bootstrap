import { exportCategories } from '@commercetools-demo/shared-code';

// const categories = [__dirname, '../../', 'fashion-store', 'typescript', 'files', 'categories.csv'];
const categories = [__dirname, '../../', process.env.BASE_DIR || 'b2c', 'typescript', 'files', 'categories.csv'];
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
  JSON.parse(process.env.IGNORED_LOCALES || ''),
).then(() => process.exit());
