import { InventoryImport } from '@commercetools/importapi-sdk';
import { notEmpty } from '../helpers';
import { importInventoryData } from '../../import/importApi';
import { importItems, readAndTransformCSV } from '../importHelpers';

export interface ProductVariantCsvRow {
  sku: string;
  inventory: string;
}
export const toInventory = (sku: string) => (inventory: string) => {
  const [quantityOnStock, restockableInDays, supplyChannel] = inventory.split(/\s/);
  let inventoryImport: InventoryImport = {
    key: 'inventory-' + sku,
    sku: sku,
    quantityOnStock: Number(quantityOnStock),
    restockableInDays: restockableInDays ? Number(restockableInDays) : undefined,
  };
  if (supplyChannel) {
    inventoryImport = {
      ...inventoryImport,
      key: `inventory-${sku}-${supplyChannel}`,
      supplyChannel: {
        typeId: 'channel',
        key: supplyChannel,
      },
    };
  }
  return inventoryImport;
};

export const inventoryTransformer = async (row: ProductVariantCsvRow): Promise<Array<InventoryImport>> => {
  return row.inventory.split(';').map(toInventory(row.sku)).filter(notEmpty);
};

export const importInventory = async (importContainerKey: string, path: string, files: Array<string>) => {
  const promises = files.map((fileName) => readAndTransformCSV([path, fileName], inventoryTransformer));
  const toImport = (await Promise.all(promises)).flat().flat();

  await importItems(toImport, importContainerKey, importInventoryData, 'inventory');
};
