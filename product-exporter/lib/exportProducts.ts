import { exportProducts, StringMap } from '@commercetools-demo/shared-code';

const goodstoreFile = [__dirname, '../../', 'b2c', 'typescript', 'files', 'products.csv'];
const goodstoreHeaders = ['productType', 'sku', 'tax', 'categories', 'baseId'];

const goodstoreStringMapper: StringMap = {
  'standard-tax-category': 'vat-standard',
};

exportProducts(goodstoreFile, goodstoreHeaders, goodstoreStringMapper, [
  'en-AU',
  'ar-AE',
  'en-CA',
  'es-ES',
  'es-MX',
  'fr-CA',
  'fr-FR',
  'it-IT',
  'ja-JP',
  'nl-NL',
  'pt-PT',
  'zh-CN',
]).then(() => process.exit());
