import { exportProductTypes } from '@commercetools-demo/shared-code';

const goodstoreProductTypes = [__dirname, '../../', 'b2c', 'terraform'];

exportProductTypes(goodstoreProductTypes, [
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
