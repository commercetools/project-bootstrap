import { apiRoot } from './client';
import { DEFAULT_BATCH_SIZE } from '../helper/config';
import { splitForImport } from '../helper/importHelpers';
import { deleteItems } from '../helper/deleteHelpers';

export const getInventory = async (limit: number) => {
  const { body } = await apiRoot
    .inventory()
    .get({ queryArgs: { limit: limit } })
    .execute();
  return body;
};

export const deleteInventory = async (id: string, version: number) => {
  return await apiRoot
    .inventory()
    .withId({ ID: id })
    .delete({ queryArgs: { version: version } })
    .execute();
};

export const deleteInventoryBatch = async (limit: number) => {
  const toDelete = await getInventory(limit);
  const batches = splitForImport(toDelete.results, 2);
  for (const batch of batches) {
    await Promise.all(
      batch.map(async (item) => {
        await deleteInventory(item.id, item.version);
      }),
    );
  }
};

export const deleteAllInventory = async (amount = DEFAULT_BATCH_SIZE) => {
  const inventory = await getInventory(1);
  const total = inventory.total || 0;
  await deleteItems(total, deleteInventoryBatch, amount, 'inventory');
};
