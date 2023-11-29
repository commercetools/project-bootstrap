import { apiRoot } from './client';
import { deleteItems } from '../helper/deleteHelpers';

export const getOrders = async (limit: number) => {
  const { body } = await apiRoot
    .orders()
    .get({ queryArgs: { limit: limit } })
    .execute();
  return body;
};

export const deleteOrder = async (id: string, version: number) => {
  try {
    return await apiRoot
      .orders()
      .withId({ ID: id })
      .delete({ queryArgs: { version: version } })
      .execute();
  } catch (e) {
    console.log(e);
  }
};

export const deleteOrderBatch = async (limit: number) => {
  const toDelete = await getOrders(limit);
  for (const item of toDelete.results) {
    await deleteOrder(item.id, item.version);
  }
};

export const deleteAllOrders = async (batchSize = 500) => {
  const orders = await getOrders(1);
  const total = orders.total || 0;
  await deleteItems(total, deleteOrderBatch, batchSize, 'orders');
};
