import { CategoryImport, CategoryKeyReference } from '@commercetools/importapi-sdk';
import {
  clean,
  formatCategoryLocalizedSlug,
  fillMissingLanguages,
  formatRowAsLocalizedString,
  readLanguages,
} from '../helpers';
import { importCategoryDrafts } from '../../import/importApi';
import { importItems, readAndTransformCSV } from '../importHelpers';

export interface CategoryCsvRow {
  key: string;
  name_en: string;
  slug_en: string;
  name_de: string;
  slug_de: string;
  name_it: string;
  slug_it: string;
  parentId: string;
  orderHint: string;
  externalId: string;
}
const buildSlug = (category: CategoryImport, allCategories: Array<CategoryImport>) => {
  let result = [category.name];
  if (category.parent) {
    const parent = allCategories.find((value) => value.key === category.parent?.key);
    if (parent) {
      const parentSlug = buildSlug(parent, allCategories);
      result = [...parentSlug, ...result];
    }
  }
  return result;
};

export const updateSlug = async (
  category: CategoryImport,
  allCategories: Array<CategoryImport>,
  languages: Array<string>,
): Promise<CategoryImport> => {
  if (!category.slug || Object.keys(category.slug).length === 0) {
    const newSlug = buildSlug(category, allCategories);
    const merged = newSlug.reduce((result, current) => {
      languages.forEach((language) => {
        if (result[language]) {
          result[language] = clean(result[language] + '-' + current[language]);
        } else {
          result[language] = clean(current[language]);
        }
      });
      return result;
    }, {});
    return { ...category, slug: merged };
  }
  return category;
};

export const categoryTransform = async (row: CategoryCsvRow) => {
  let parent: CategoryKeyReference | undefined = undefined;
  if (row.parentId !== undefined && row.parentId !== '') {
    parent = {
      typeId: 'category',
      key: row.parentId,
    };
  }
  const languages = await readLanguages();

  const name = await fillMissingLanguages(formatRowAsLocalizedString(row, 'name', languages), languages);

  const categoryImport: CategoryImport = {
    name: name,
    description: await fillMissingLanguages(formatRowAsLocalizedString(row, 'description', languages), languages, name),
    slug: await formatCategoryLocalizedSlug(
      await fillMissingLanguages(formatRowAsLocalizedString(row, 'slug', languages), languages, name),
      languages,
    ),
    key: row.key,
    externalId: row.externalId,
    orderHint: row.orderHint,
    parent: parent,
  };
  return categoryImport;
};

export const importCategories = async (importContainerKey: string, path: string, files: Array<string>) => {
  const promises = files.map((fileName) => readAndTransformCSV([path, fileName], categoryTransform));
  const categories = (await Promise.all(promises)).flat();
  const languages = await readLanguages();
  const toImport = await Promise.all(
    categories.map(async (category) => {
      return await updateSlug(category, categories, languages);
    }),
  );
  await importItems(toImport, importContainerKey, importCategoryDrafts, 'categories');
};
