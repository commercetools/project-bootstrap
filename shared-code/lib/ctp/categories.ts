import { CategoryDraft, CategoryUpdateAction } from '@commercetools/platform-sdk';
import { apiRoot } from './client';
import { DEFAULT_BATCH_SIZE } from '../helper/config';

export interface CategoryDraftWithKey extends CategoryDraft {
  key: string;
}

export const getCategories = async (limit: number) => {
  const { body } = await apiRoot
    .categories()
    .get({ queryArgs: { limit: limit } })
    .execute();
  return body;
};

export const deleteCategory = async (id: string, version: number) => {
  return apiRoot
    .categories()
    .withId({ ID: id })
    .delete({ queryArgs: { version: version } })
    .execute()
    .then((deletedCategory) => {
      return console.log('Successfully deleted category ' + deletedCategory.body.id);
    })
    .catch(console.log);
};

export const deleteCategoryBatch = async (limit: number) => {
  const toDelete = await getCategories(limit);

  for (const item of toDelete.results) {
    await deleteCategory(item.id, item.version);
  }
};

export const deleteAllCategories = async (amount = DEFAULT_BATCH_SIZE) => {
  const categories = await getCategories(1);
  let total = categories.total || 0;
  while (total > 0) {
    console.log(total + ' categories to delete.');
    await deleteCategoryBatch(amount);
    total -= amount;
  }
};

export const getCategoryById = async (id: string) => {
  const { body } = await apiRoot.categories().withId({ ID: id }).get().execute();
  return body;
};

export const getCategoryByKey = async (key: string) => {
  const { body } = await apiRoot.categories().withKey({ key: key }).get().execute();
  return body;
};

export const getCategoryBySlug = async (slug: string, locale: string) => {
  const { body } = await apiRoot
    .categories()
    .get({ queryArgs: { where: 'slug(' + locale + '="' + slug + '")' } })
    .execute();
  return body;
};

export const deleteCategoryByKey = (key: string) => {
  console.log('Deleting Category with key: ' + key);
  return getCategoryByKey(key)
    .then((loadedCategory) => {
      return apiRoot
        .categories()
        .withKey({ key: key })
        .delete({ queryArgs: { version: loadedCategory.version } })
        .execute()
        .then(({ body }) => {
          return body;
        });
    })
    .catch((error) => {
      console.log(error.body.message);
      return null;
    });
};

export const createCategory = (CategoryDraft: CategoryDraftWithKey) => {
  return apiRoot
    .categories()
    .post({ body: CategoryDraft })
    .execute()
    .then(({ body }) => {
      return body;
    });
};

export const createOrGetCategory = (categoryDraft: CategoryDraftWithKey) => {
  console.log('Creating Category with key: ' + categoryDraft.key);
  return getCategoryByKey(categoryDraft.key)
    .then((Category) => {
      console.log('Category ' + categoryDraft.key + ' already exists');
      return Category;
    })
    .catch(async () => {
      return await createCategory(categoryDraft).then((category) => {
        return category;
      });
    });
};

export const updateCategory = async (id: string, version: number, actions: Array<CategoryUpdateAction>) => {
  return await apiRoot
    .categories()
    .withId({ ID: id })
    .post({ body: { version: version, actions: actions } })
    .execute();
};
