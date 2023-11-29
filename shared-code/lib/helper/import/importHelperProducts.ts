import { CategoryKeyReference, ProductDraftImport } from '@commercetools/importapi-sdk';
import defaultDescription from './defaultDescription.json';
import {
  cleanLocalizedStringForSlug,
  fillMissingLanguages,
  formatRowAsLocalizedString,
  notEmpty,
  readLanguages,
} from '../helpers';
import { importProductData } from '../../import/importApi';
import { importItems, readAndTransformCSV } from '../importHelpers';

export interface ProductCsvRow {
  productType: string;
  sku: string;
  tax: string;
  categories: string;
  baseId: string;
}

export const withCategories = (categoryStrings: string): Array<CategoryKeyReference> => {
  return categoryStrings
    .split(';')
    .filter((value) => value !== '')
    .filter(notEmpty)
    .map((key) => {
      const reference: CategoryKeyReference = { typeId: 'category', key: key };
      return reference;
    });
};

export const productTransformer = async (row: ProductCsvRow): Promise<ProductDraftImport> => {
  //Since there is a productType, this is a ProductDraftImport
  const languages = await readLanguages();
  const name = await fillMissingLanguages(formatRowAsLocalizedString(row, 'name', languages), languages);
  const description = await fillMissingLanguages(
    formatRowAsLocalizedString(row, 'description', languages),
    languages,
    defaultDescription,
  );
  const slug = cleanLocalizedStringForSlug(
    await fillMissingLanguages(formatRowAsLocalizedString(row, 'slug', languages), languages, name),
    languages,
  );
  return {
    productType: { typeId: 'product-type', key: row.productType },
    name: name,
    slug: slug,
    description: description,
    metaTitle: await fillMissingLanguages(formatRowAsLocalizedString(row, 'metaTitle', languages), languages, name),
    metaDescription: await fillMissingLanguages(
      formatRowAsLocalizedString(row, 'metaDescription', languages),
      languages,
      description,
    ),
    metaKeywords: await fillMissingLanguages(
      formatRowAsLocalizedString(row, 'metaKeywords', languages),
      languages,
      name,
    ),
    key: row.baseId,
    taxCategory: { typeId: 'tax-category', key: row.tax },
    categories: withCategories(row.categories),
    publish: true,
  };
};

export const productFilter = (record: ProductCsvRow) => {
  return record.productType ? record : null;
};

export const importProducts = async (importContainerKey: string, path: string, files: Array<string>) => {
  const promises = files.map((fileName) => readAndTransformCSV([path, fileName], productTransformer, productFilter));
  const toImport = (await Promise.all(promises)).flat();
  await importItems(toImport, importContainerKey, importProductData, 'products');
};
