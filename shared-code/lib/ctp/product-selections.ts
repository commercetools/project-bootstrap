import { apiRoot } from './client';

export const getProductSelections = async (limit: number) => {
  const { body } = await apiRoot
    .productSelections()
    .get({ queryArgs: { limit: limit } })
    .execute();
  return body;
};
