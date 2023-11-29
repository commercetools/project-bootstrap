import { StoreDraft, StoreUpdateAction } from '@commercetools/platform-sdk';
import { apiRoot } from './client';
import { DEFAULT_BATCH_SIZE } from '../helper/config';
import { deleteItems } from '../helper/deleteHelpers';

export const getStoreByKey = (key: string) => {
  return apiRoot
    .stores()
    .withKey({ key: key })
    .get()
    .execute()
    .then(({ body }) => {
      return body;
    });
};

export const deleteStoreByKey = (key: string) => {
  console.log('Deleting store with key: ' + key);
  return getStoreByKey(key)
    .then((loadedStore) => {
      return apiRoot
        .stores()
        .withKey({ key: key })
        .delete({ queryArgs: { version: loadedStore.version } })
        .execute();
    })
    .catch((error) => {
      console.log(error.body.message);
      return null;
    });
};

export const createStore = (storeDraft: StoreDraft) => {
  return apiRoot
    .stores()
    .post({ body: storeDraft })
    .execute()
    .then(({ body }) => {
      return body;
    });
};

export const createOrGetStore = (storeDraft: StoreDraft) => {
  console.log('Creating store with key: ' + storeDraft.key);
  return getStoreByKey(storeDraft.key)
    .then((item) => {
      console.log('Store ' + storeDraft.key + ' already exists');
      return item;
    })
    .catch(() => {
      return createStore(storeDraft);
    });
};

export const getStores = async (limit: number) => {
  const { body } = await apiRoot
    .stores()
    .get({ queryArgs: { limit: limit } })
    .execute();
  return body;
};

export const deleteStore = async (id: string, version: number) => {
  try {
    return await apiRoot
      .stores()
      .withId({ ID: id })
      .delete({ queryArgs: { version: version } })
      .execute();
  } catch (e) {
    console.log(e);
  }
};

const deleteStoresBatch = async (limit: number) => {
  const toDelete = await getStores(limit);
  for (const item of toDelete.results) {
    await deleteStore(item.id, item.version);
  }
};

export const deleteAllStores = async (batchSize = DEFAULT_BATCH_SIZE) => {
  const customers = await getStores(1);
  const total = customers.total || 0;
  await deleteItems(total, deleteStoresBatch, batchSize, 'stores');
};

export const updateStores = async (id: string, version: number, actions: Array<StoreUpdateAction>) => {
  return await apiRoot
    .stores()
    .withId({ ID: id })
    .post({ body: { version: version, actions: actions } })
    .execute();
};
