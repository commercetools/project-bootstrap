import { ClientResponse, Customer, CustomerDraft, CustomerToken } from '@commercetools/platform-sdk';
import { apiRoot } from './client';
import { DEFAULT_BATCH_SIZE } from '../helper/config';
import { deleteItems } from '../helper/deleteHelpers';

export interface CustomerDraftWithKey extends CustomerDraft {
  key: string;
}

export const getCustomers = async (limit: number) => {
  const { body } = await apiRoot
    .customers()
    .get({ queryArgs: { limit: limit } })
    .execute();
  return body;
};

export const getCustomerById = (ID: string) => {
  return apiRoot.customers().withId({ ID: ID }).get().execute();
};

export const getCustomerByKey = async (key: string) => {
  const { body } = await apiRoot.customers().withKey({ key: key }).get().execute();
  return body;
};

export const createCustomerToken = (customer: Customer) => {
  return apiRoot
    .customers()
    .emailToken()
    .post({ body: { id: customer.id, ttlMinutes: 90 } })
    .execute();
};

export const confirmCustomerEmail = (token: ClientResponse<CustomerToken>) => {
  return apiRoot
    .customers()
    .emailConfirm()
    .post({ body: { tokenValue: token.body.value } })
    .execute();
};

export const deleteCustomerByKey = (key: string) => {
  console.log('Deleting user with key: ' + key);
  return getCustomerByKey(key)
    .then((loadedCustomer) => {
      return apiRoot
        .customers()
        .withKey({ key: key })
        .delete({ queryArgs: { version: loadedCustomer.version } })
        .execute();
    })
    .catch((error) => {
      console.log(error.body.message);
      return null;
    });
};

export const deleteCustomer = async (id: string, version: number) => {
  try {
    return await apiRoot
      .customers()
      .withId({ ID: id })
      .delete({ queryArgs: { version: version } })
      .execute();
  } catch (e) {
    console.log(e);
  }
};

export const deleteCustomerBatch = async (limit: number) => {
  const toDelete = await getCustomers(limit);
  for (const item of toDelete.results) {
    await deleteCustomer(item.id, item.version);
  }
};

export const createCustomer = (customerDraft: CustomerDraftWithKey) => {
  return apiRoot
    .customers()
    .post({ body: customerDraft })
    .execute()
    .then(({ body }) => {
      return body.customer;
    });
};

export const createOrGetCustomer = (customerDraft: CustomerDraftWithKey) => {
  // console.log("Creating user with key: " + customerDraft.key);
  return getCustomerByKey(customerDraft.key)
    .then((customer) => {
      // console.log("User " + customerDraft.key + " already exists");
      return customer;
    })
    .catch(() => {
      return createCustomer(customerDraft).then((customer) => {
        return createCustomerToken(customer).then((token) => {
          return confirmCustomerEmail(token).then(({ body }) => {
            return body;
          });
        });
      });
    });
};

export const deleteAllCustomers = async (batchSize = DEFAULT_BATCH_SIZE) => {
  const customers = await getCustomers(1);
  const total = customers.total || 0;
  await deleteItems(total, deleteCustomerBatch, batchSize, 'customers');
};
