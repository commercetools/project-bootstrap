import { BusinessUnit, BusinessUnitDraft } from '@commercetools/platform-sdk';
import { apiRoot } from './client';
import { DEFAULT_BATCH_SIZE } from '../helper/config';
import { deleteItems } from '../helper/deleteHelpers';

export const getBusinessUnits = async (limit: number) => {
  const { body } = await apiRoot
    .businessUnits()
    .get({ queryArgs: { limit: limit } })
    .execute();
  return body;
};

export const getBusinessUnitByKey = (key: string) => {
  return apiRoot.businessUnits().withKey({ key: key }).get().execute();
};
export const createBusinessUnit = (businessUnitDraft: BusinessUnitDraft): Promise<BusinessUnit | null> => {
  return apiRoot
    .businessUnits()
    .post({ body: businessUnitDraft })
    .execute()
    .then((item) => {
      return item.body;
    })
    .catch((error) => {
      console.error(error.body.message);
      return null;
    });
};

export const createOrGetBusinessUnit = (businessUnitDraft: BusinessUnitDraft) => {
  console.log('Creating business unit with key: ' + businessUnitDraft.key);
  return getBusinessUnitByKey(businessUnitDraft.key)
    .then((item) => {
      console.log('Business Unit ' + businessUnitDraft.key + ' already exists');
      return item.body;
    })
    .catch(() => {
      return createBusinessUnit(businessUnitDraft);
    });
};

export const deleteBusinessUnitByKey = (key: string) => {
  console.log('Deleting Business Unit with key: ' + key);
  return getBusinessUnitByKey(key)
    .then((loaded) => {
      return apiRoot
        .businessUnits()
        .withKey({ key: key })
        .delete({ queryArgs: { version: loaded.body.version } })
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

export const deleteBusinessUnit = async (id: string, version: number) => {
  try {
    return await apiRoot
      .businessUnits()
      .withId({ ID: id })
      .delete({ queryArgs: { version: version } })
      .execute();
  } catch (e) {
    console.log(e);
  }
};

export const deleteBusinessUnitsBatch = async (limit: number) => {
  const toDelete = await getBusinessUnits(limit);
  for (const item of toDelete.results) {
    await deleteBusinessUnit(item.id, item.version);
  }
};

export const deleteAllBusinessUnits = async (batchSize = DEFAULT_BATCH_SIZE) => {
  const customers = await getBusinessUnits(1);
  const total = customers.total || 0;
  await deleteItems(total, deleteBusinessUnitsBatch, batchSize, 'business units');
};
