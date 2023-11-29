import { apiRoot } from './client';
import type { ShippingMethodUpdateAction } from '@commercetools/platform-sdk';

export const getShippingMethods = () => {
  return apiRoot
    .shippingMethods()
    .get()
    .execute()
    .then(({ body }) => {
      return body;
    });
};

export const updateShippingMethods = async (
  id: string,
  version: number,
  actions: Array<ShippingMethodUpdateAction>,
) => {
  return await apiRoot
    .shippingMethods()
    .withId({ ID: id })
    .post({ body: { version: version, actions: actions } })
    .execute();
};
