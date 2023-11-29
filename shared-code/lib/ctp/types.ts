import { ClientResponse, Type } from '@commercetools/platform-sdk';
import { apiRoot } from './client';

export const getTypeById = (ID: string): Promise<ClientResponse<Type>> => {
  return apiRoot.types().withId({ ID: ID }).get().execute();
};

export const getTypeByKey = (key: string): Promise<Type> => {
  return apiRoot
    .types()
    .withKey({ key: key })
    .get()
    .execute()
    .then(({ body }) => {
      return body;
    });
};
