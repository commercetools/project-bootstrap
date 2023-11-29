import { apiRoot } from './client';
import { DEFAULT_BATCH_SIZE } from '../helper/config';
import { deleteItems } from '../helper/deleteHelpers';

export const getCarts = async (limit: number) => {
  const { body } = await apiRoot
    .carts()
    .get({ queryArgs: { limit: limit } })
    .execute();
  return body;
};

export const deleteCart = async (id: string, version: number) => {
  try {
    return await apiRoot
      .carts()
      .withId({ ID: id })
      .delete({ queryArgs: { version: version } })
      .execute();
  } catch (e) {
    console.log(e);
  }
};

const deleteCartsBatch = async (limit: number) => {
  const toDelete = await getCarts(limit);
  for (const item of toDelete.results) {
    await deleteCart(item.id, item.version);
  }
};

export const deleteAllCarts = async (batchSize = DEFAULT_BATCH_SIZE) => {
  const customers = await getCarts(1);
  const total = customers.total || 0;
  await deleteItems(total, deleteCartsBatch, batchSize, 'cart');
};
