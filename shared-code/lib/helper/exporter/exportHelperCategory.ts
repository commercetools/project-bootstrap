import { Category } from '@commercetools/platform-sdk';
import { StringMap } from '../../export/exportService';
import { addLocalizedString } from '../exportHelper';

export const addKeyAndExternalIdIfEmpty = (item: Category, index: number): Category => {
  return { ...item, key: item.key || index + 1 + '', externalId: item.externalId || index + 1 + '' };
};

export const setParentObj = (item: Category, result: Array<Category>): Category => {
  if (item.parent) {
    const parent = result.find((value) => value.id === item.parent?.id);
    if (parent) {
      return { ...item, parent: { ...item.parent, obj: parent } };
    }
  }
  return { ...item };
};

export const mapCategory = (item: Category, obsoleteLocales?: Array<string>) => {
  const row: StringMap = {
    key: item.key,
    externalId: item.externalId,
    parentId: item.parent?.obj?.key,
    orderHint: item.orderHint,
  };
  addLocalizedString(item.name, row, 'name', obsoleteLocales);
  addLocalizedString(item.description, row, 'description', obsoleteLocales);
  addLocalizedString(item.slug, row, 'slug', obsoleteLocales);
  return row;
};
