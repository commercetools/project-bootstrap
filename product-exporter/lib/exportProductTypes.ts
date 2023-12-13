import { exportProductTypes } from '@commercetools-demo/shared-code';

const productTypes = [__dirname, '../../', process.env.BASE_DIR || 'b2c', 'terraform'];

exportProductTypes(productTypes, JSON.parse(process.env.IGNORED_LOCALES || '')).then(() => process.exit());
