import { ProductTypeUpdateAction } from '@commercetools/platform-sdk';
import { apiRoot } from './client';

export const getProductTypes = async () => {
  const { body } = await apiRoot.productTypes().get().execute();
  return body;
};

export const getProductTypeByKey = async (key: string) => {
  const { body } = await apiRoot.productTypes().withKey({ key: key }).get().execute();
  return body;
};

export const updateProductType = async (id: string, version: number, actions: Array<ProductTypeUpdateAction>) => {
  return await apiRoot
    .productTypes()
    .withId({ ID: id })
    .post({ body: { version: version, actions: actions } })
    .execute();
};
