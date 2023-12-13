import { exportProducts, StringMap } from '@commercetools-demo/shared-code';

const products = [__dirname, '../../', process.env.BASE_DIR || 'b2c', 'typescript', 'files', 'products.csv'];
const headers = ['productType', 'sku', 'tax', 'categories', 'baseId'];

const mappers: StringMap = {
  'standard-tax-category': 'vat-standard',
};

exportProducts(products, headers, mappers, JSON.parse(process.env.IGNORED_LOCALES || '')).then(() => process.exit());
