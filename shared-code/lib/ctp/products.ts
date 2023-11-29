import { ProductUpdateAction } from '@commercetools/platform-sdk';
import { apiRoot } from './client';
import { DEFAULT_BATCH_SIZE } from '../helper/config';
import { deleteItems } from '../helper/deleteHelpers';

export const getProducts = async (
  limit: number,
  offset?: number,
  expand?: string | Array<string>,
  where?: string | Array<string>,
) => {
  const { body } = await apiRoot
    .products()
    .get({ queryArgs: { limit: limit, offset: offset, expand: expand, where: where } })
    .execute();
  return body;
};

export const deleteProduct = async (id: string, version: number) => {
  return apiRoot
    .products()
    .withId({ ID: id })
    .delete({ queryArgs: { version: version } })
    .execute()
    .then((deletedProduct) => {
      // return console.log("Successfully deleted product " + deletedProduct.body.id);
      return deletedProduct.body.id;
    })
    .catch(console.log);
};

export const getProductByKey = async (key: string) => {
  return await apiRoot
    .products()
    .withKey({ key: key })
    .get()
    .execute()
    .then(({ body }) => {
      return body;
    });
};

export const publishProduct = async (id: string, version: number) => {
  return await apiRoot
    .products()
    .withId({ ID: id })
    .post({ body: { actions: [{ action: 'publish' }], version: version } })
    .execute();
};

export const unpublishAndDeleteProduct = async (id: string, version: number) => {
  const unpublish = await apiRoot
    .products()
    .withId({ ID: id })
    .post({ body: { actions: [{ action: 'unpublish' }], version: version } })
    .execute();

  return await deleteProduct(unpublish.body.id, unpublish.body.version);
};

export const deleteProductBatch = async (limit: number) => {
  const toDelete = await getProducts(limit);
  for (const item of toDelete.results) {
    if (item.masterData.published) {
      await unpublishAndDeleteProduct(item.id, item.version);
    } else {
      await deleteProduct(item.id, item.version);
    }
  }
};

export const deleteAllProducts = async (batchSize = DEFAULT_BATCH_SIZE) => {
  const products = await getProducts(1);
  const total = products.total || 0;
  await deleteItems(total, deleteProductBatch, batchSize, 'products');
};

export const publishAllProducts = async (batchSize = DEFAULT_BATCH_SIZE) => {
  const unpublishedOrChanged = 'masterData(published="false" or hasStagedChanges="true")';
  const products = await getProducts(1, undefined, undefined, unpublishedOrChanged);
  const total = products.total || 0;
  for (let i = 0; i <= total; i = i + batchSize) {
    const max = Math.min(i + 500, total);
    const { results } = await getProducts(DEFAULT_BATCH_SIZE, i, undefined, unpublishedOrChanged);
    console.log('Publishing products ' + i + ' to ' + max);
    for (const product of results) {
      await publishProduct(product.id, product.version);
    }
    console.log('Published products ' + i + ' to ' + max);
  }
};

export const updateProduct = async (id: string, version: number, actions: Array<ProductUpdateAction>) => {
  return await apiRoot
    .products()
    .withId({ ID: id })
    .post({ body: { version: version, actions: actions } })
    .execute();
};
