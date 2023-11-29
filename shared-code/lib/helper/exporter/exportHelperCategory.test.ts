import { expect, test } from '@jest/globals';
import { Category } from '@commercetools/platform-sdk';
import { addKeyAndExternalIdIfEmpty, mapCategory, setParentObj } from './exportHelperCategory';

const category: Category = {
  id: 'id',
  version: 1,
  createdAt: '',
  lastModifiedAt: '',
  name: { 'en-GB': 'name', 'de-DE': 'name' },
  slug: { 'en-GB': 'slug', 'de-DE': 'slug' },
  description: { 'en-GB': 'description', 'de-DE': 'description' },
  ancestors: [],
  orderHint: '',
};

describe('Test addKeyAndExternalIdIfEmpty', () => {
  test('default', async () => {
    const index = 2;
    const result = addKeyAndExternalIdIfEmpty(category, index);
    expect(result.externalId).toEqual(index + 1 + '');
    expect(result.key).toEqual(index + 1 + '');
  });
  test('with key', async () => {
    const result = addKeyAndExternalIdIfEmpty(
      {
        ...category,
        key: 'key',
      },
      2,
    );
    expect(result.key).toEqual('key');
  });
  test('with external id', async () => {
    const result = addKeyAndExternalIdIfEmpty(
      {
        ...category,
        externalId: 'externalId',
      },
      2,
    );
    expect(result).toEqual(expect.objectContaining({ externalId: 'externalId' }));
  });
});

describe('Test setParentObj', () => {
  const grandma: Category = { ...category, id: 'grandma' };
  const mother: Category = { ...category, id: 'mother', key: 'mother', parent: { id: 'grandma', typeId: 'category' } };
  const daughter: Category = { ...category, id: 'daughter', parent: { id: 'mother', typeId: 'category' } };
  test('default', async () => {
    const result = setParentObj(daughter, [daughter, mother, grandma]);
    expect(result.parent?.obj).not.toBe(undefined);
    expect(result.parent?.obj?.id).toEqual('mother');
    expect(result.parent?.obj?.key).toEqual('mother');
  });

  test('default', async () => {
    const result = setParentObj(grandma, [daughter, mother, grandma]);
    expect(result.parent?.obj).toBe(undefined);
  });
});

describe('Test mapCategory', () => {
  const mother: Category = { ...category, id: 'mother', key: 'mother', parent: { id: 'grandma', typeId: 'category' } };
  const daughter: Category = { ...category, id: 'daughter', parent: { id: 'mother', typeId: 'category' } };
  test('default', async () => {
    const result = mapCategory(setParentObj(daughter, [daughter, mother]), ['en-GB']);
    expect(result).toEqual(
      expect.objectContaining({
        'description_de-DE': 'description',
        externalId: undefined,
        key: undefined,
        'name_de-DE': 'name',
        orderHint: '',
        parentId: mother.key,
        'slug_de-DE': 'slug',
      }),
    );
  });
});
