import { resolve } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { stringify } from 'csv-stringify/sync';
import { Options } from 'csv-stringify';
import { getProducts } from '../ctp/products';
import { DEFAULT_BATCH_SIZE } from '../helper/config';
import { getCategories } from '../ctp/categories';
import { getProductTypes } from '../ctp/product-types';
import { addKeyAndExternalIdIfEmpty, mapCategory, setParentObj } from '../helper/exporter/exportHelperCategory';
import { handleProduct } from '../helper/exporter/exportHelperProduct';
import { handleProductType } from '../helper/exporter/exportHelperProductType';
import { readLanguages } from '../helper/helpers';

export type StringMap = { [id: string]: string | undefined };

export const exportProducts = async (
  writeTo: Array<string>,
  headers: Array<string>,
  stringMapper: StringMap,
  obsoleteLocales?: Array<string>,
) => {
  let total = (await getProducts(1)).total || 0;
  if (total <= 0) {
    return;
  }
  console.log('Exporting ' + total + ' products.');

  const types = await getProductTypes();
  let mappedProducts: Array<Array<StringMap>> = [];
  const additionalHeaders = new Set<string>();
  while (total > 0) {
    const { results } = await getProducts(DEFAULT_BATCH_SIZE, undefined, [
      'taxCategory',
      'productType',
      'masterData.current.masterVariant.attributes[*].value[*]',
      'masterData.current.variants[*].attributes[*].value[*]',
      'masterData.current.categories[*]',
    ]);
    mappedProducts = mappedProducts.concat(
      results.map((item) => handleProduct(item, stringMapper, types.results, obsoleteLocales)),
    );
    total -= DEFAULT_BATCH_SIZE;
  }
  mappedProducts.flat().forEach((item) => Object.keys(item).forEach((item) => additionalHeaders.add(item)));

  const options: Options = { header: true };
  headers.forEach((value) => additionalHeaders.delete(value));
  options.columns = headers.concat([...additionalHeaders].sort((a, b) => a.localeCompare(b)));
  const output = stringify(mappedProducts.flat(), options);
  writeFileSync(resolve(__dirname, '../../', ...writeTo), output);
};

export const exportCategories = async (
  writeTo: Array<string>,
  headers: Array<string>,
  obsoleteLocales?: Array<string>,
) => {
  const total = (await getCategories(1)).total || 0;
  if (total <= 0) {
    return;
  }
  console.log('Exporting ' + total + ' category items.');
  const { results } = await getCategories(DEFAULT_BATCH_SIZE);
  const result = results.map(addKeyAndExternalIdIfEmpty);
  const newResult = result.map((item) => setParentObj(item, result)).map((item) => mapCategory(item, obsoleteLocales));
  const output = stringify(newResult, { header: true, columns: headers });
  writeFileSync(resolve(__dirname, '../../', ...writeTo), output);

  return;
};

export const exportProductTypes = async (writeTo: Array<string>, obsoleteLocales?: Array<string>) => {
  const productTypes = await getProductTypes();
  let languages: Array<string> = await readLanguages();
  console.log('Exporting ' + productTypes.count + ' product types.');

  if (obsoleteLocales) {
    languages = languages.filter((n) => !obsoleteLocales.includes(n));
  }

  for (const productType of productTypes.results) {
    const result = await handleProductType(productType, languages);
    if (result) {
      const path = resolve(__dirname, '../../', ...writeTo);
      if (!existsSync(path)) {
        mkdirSync(path);
      }
      const filename = resolve(path, productType.key + '.tf');
      writeFileSync(filename, result);
      console.log('Created file ' + filename);
    }
  }
};
