import { apiRoot } from './client';
import { DEFAULT_BATCH_SIZE } from '../helper/config';
import { deleteItems } from '../helper/deleteHelpers';

export const getShoppingLists = async (limit: number) => {
  const { body } = await apiRoot
    .shoppingLists()
    .get({ queryArgs: { limit: limit } })
    .execute();
  return body;
};

export const deleteShoppingList = async (id: string, version: number) => {
  try {
    return await apiRoot
      .shoppingLists()
      .withId({ ID: id })
      .delete({ queryArgs: { version: version } })
      .execute();
  } catch (e) {
    console.log(e);
  }
};

const deleteShoppingListsBatch = async (limit: number) => {
  const toDelete = await getShoppingLists(limit);
  for (const item of toDelete.results) {
    await deleteShoppingList(item.id, item.version);
  }
};

export const deleteAllShoppingLists = async (batchSize = DEFAULT_BATCH_SIZE) => {
  const shoppingLists = await getShoppingLists(1);
  const total = shoppingLists.total || 0;
  await deleteItems(total, deleteShoppingListsBatch, batchSize, 'cart');
};
