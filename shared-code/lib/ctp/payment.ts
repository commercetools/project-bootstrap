import { apiRoot } from './client';
import { DEFAULT_BATCH_SIZE } from '../helper/config';
import { deleteItems } from '../helper/deleteHelpers';

export const getPayments = async (limit: number) => {
  const { body } = await apiRoot
    .payments()
    .get({ queryArgs: { limit: limit } })
    .execute();
  return body;
};

export const deletePayments = async (id: string, version: number) => {
  try {
    return await apiRoot
      .payments()
      .withId({ ID: id })
      .delete({ queryArgs: { version: version } })
      .execute();
  } catch (e) {
    console.log(e);
  }
};

const deletePaymentsBatch = async (limit: number) => {
  const toDelete = await getPayments(limit);
  for (const item of toDelete.results) {
    await deletePayments(item.id, item.version);
  }
};

export const deleteAllPayments = async (batchSize = DEFAULT_BATCH_SIZE) => {
  const customers = await getPayments(1);
  const total = customers.total || 0;
  await deleteItems(total, deletePaymentsBatch, batchSize, 'payments');
};
