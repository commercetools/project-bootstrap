import { expect, test } from '@jest/globals';
import { CategoryImport } from '@commercetools/importapi-sdk/dist/declarations/src/generated/models/categories';
import { CategoryKeyReference } from '@commercetools/importapi-sdk';
import { updateSlug } from './importHelperCategories';

const createCategoryImport = (identifier: string, slug?: string, parentKey?: string): CategoryImport => {
  let parent: CategoryKeyReference | undefined = undefined;
  if (parentKey) {
    parent = {
      typeId: 'category',
      key: parentKey,
    };
  }
  return { name: { en: identifier }, key: identifier, slug: slug ? { en: slug } : {}, parent: parent };
};

describe('Test updateSlug', () => {
  const grandma: CategoryImport = createCategoryImport('grandma', 'grandma');
  const mother: CategoryImport = createCategoryImport('mother', undefined, grandma.key);
  const daughter: CategoryImport = createCategoryImport('daughter', 'daughter', mother.key);
  test('default', async () => {
    updateSlug(daughter, [mother, grandma], ['en']).then((result) => {
      expect(result).toEqual(
        expect.objectContaining({
          name: {
            en: 'daughter',
          },
          slug: {
            en: 'daughter',
          },
        }),
      );
    });
  });
  test('no slug', async () => {
    updateSlug(mother, [daughter, mother, grandma], ['en']).then((result) => {
      expect(result.slug).toEqual(
        expect.objectContaining({
          en: 'grandma-mother',
        }),
      );
    });
  });
});
