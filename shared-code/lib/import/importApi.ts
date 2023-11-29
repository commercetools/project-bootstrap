import {
  ProductDraftImport,
  ProductDraftImportRequest,
  ClientResponse,
  ImportContainer,
  ImportSummary,
  ImportOperationPagedResponse,
  ImportOperation,
  CategoryImportRequest,
  CategoryImport,
  InventoryImportRequest,
  InventoryImport,
  ProductVariantImportRequest,
  ProductVariantImport,
  PriceImport,
  PriceImportRequest,
  CustomerImport,
  CustomerImportRequest,
} from '@commercetools/importapi-sdk';
import { importApiRoot } from '../ctp/client';

export const createImportContainer = async (key: string): Promise<ImportContainer> => {
  const { body } = await importApiRoot
    .importContainers()
    .post({ body: { key: key } })
    .execute();
  return body;
};

export const getImportContainerByKey = async (key: string): Promise<ImportContainer> => {
  const { body } = await importApiRoot
    .importContainers()
    .withImportContainerKeyValue({ importContainerKey: key })
    .get()
    .execute();
  return body;
};

export const deleteImportContainerByKey = async (prefix: string, suffix?: string): Promise<null | ImportContainer> => {
  let key = prefix;
  if (suffix) {
    key = key + '-' + suffix;
  }
  console.log('Deleting import container with key: ' + key);
  return await getImportContainerByKey(key)
    .then(() => {
      return importApiRoot
        .importContainers()
        .withImportContainerKeyValue({ importContainerKey: key })
        .delete()
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

export const createOrGetImportContainer = (prefix: string, suffix?: string): Promise<ImportContainer> => {
  let key = prefix;
  if (suffix) {
    key = key + '-' + suffix;
  }
  console.log('Creating Import Container with key: ' + key);
  return getImportContainerByKey(key)
    .then((importContainer) => {
      console.log('Import Container ' + key + ' already exists');
      return importContainer;
    })
    .catch(async () => {
      return await createImportContainer(key).then((importContainer) => {
        return importContainer;
      });
    });
};

export const checkImportSummary = async (importContainerKey: string): Promise<ImportSummary> => {
  const { body } = await importApiRoot
    .importContainers()
    .withImportContainerKeyValue({ importContainerKey: importContainerKey })
    .importSummaries()
    .get()
    .execute();
  return body;
};

export const checkImportOperationsStatus = async (
  importContainerKey: string,
): Promise<ImportOperationPagedResponse> => {
  const { body } = await importApiRoot
    .importContainers()
    .withImportContainerKeyValue({ importContainerKey: importContainerKey })
    .importOperations()
    .get()
    .execute();
  return body;
};

export const checkImportOperationStatusById = (id: string): Promise<ClientResponse<ImportOperation>> => {
  return importApiRoot.importOperations().withIdValue({ id: id }).get().execute();
};

export const importProductData = async (importContainerKey: string, productDrafts: Array<ProductDraftImport>) => {
  const productDraftImportRequest: ProductDraftImportRequest = {
    type: 'product-draft',
    resources: productDrafts,
  };
  return importApiRoot
    .productDrafts()
    .importContainers()
    .withImportContainerKeyValue({ importContainerKey: importContainerKey })
    .post({ body: productDraftImportRequest })
    .execute();
};

export const importProductVariantsDrafts = async (
  importContainerKey: string,
  productDrafts: Array<ProductVariantImport>,
) => {
  const productDraftImportRequest: ProductVariantImportRequest = {
    type: 'product-variant',
    resources: productDrafts,
  };
  return importApiRoot
    .productVariants()
    .importContainers()
    .withImportContainerKeyValue({ importContainerKey: importContainerKey })
    .post({ body: productDraftImportRequest })
    .execute();
};

export const importInventoryData = async (importContainerKey: string, inventory: Array<InventoryImport>) => {
  const inventoryImportRequest: InventoryImportRequest = {
    type: 'inventory',
    resources: inventory,
  };
  return await importApiRoot
    .inventories()
    .importContainers()
    .withImportContainerKeyValue({ importContainerKey: importContainerKey })
    .post({ body: inventoryImportRequest })
    .execute();
};

export const importPricesData = async (importContainerKey: string, prices: Array<PriceImport>) => {
  const priceImportRequest: PriceImportRequest = {
    type: 'price',
    resources: prices,
  };
  return importApiRoot
    .prices()
    .importContainers()
    .withImportContainerKeyValue({ importContainerKey: importContainerKey })
    .post({ body: priceImportRequest })
    .execute();
};

export const importCategoryDrafts = async (importContainerKey: string, categoryDrafts: Array<CategoryImport>) => {
  const categoryDraftImportRequest: CategoryImportRequest = {
    type: 'category',
    resources: categoryDrafts,
  };
  return importApiRoot
    .categories()
    .importContainers()
    .withImportContainerKeyValue({ importContainerKey: importContainerKey })
    .post({ body: categoryDraftImportRequest })
    .execute();
};

export const importCustomerDrafts = async (importContainerKey: string, customerDrafts: Array<CustomerImport>) => {
  const customerDraftImportRequest: CustomerImportRequest = {
    type: 'customer',
    resources: customerDrafts,
  };
  return importApiRoot
    .customers()
    .importContainers()
    .withImportContainerKeyValue({ importContainerKey: importContainerKey })
    .post({ body: customerDraftImportRequest })
    .execute();
};
