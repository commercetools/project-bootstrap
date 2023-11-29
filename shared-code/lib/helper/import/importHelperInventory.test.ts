import { expect, test } from '@jest/globals';
import { inventoryTransformer, toInventory } from './importHelperInventory';

describe('Test inventoryTransformer', () => {
  test('default', async () => {
    inventoryTransformer({ sku: 'sku', inventory: '100' }).then((result) => {
      expect(result).toEqual(expect.arrayContaining([{ key: 'inventory-sku', quantityOnStock: 100, sku: 'sku' }]));
    });
  });
  test('multiple', async () => {
    const storeDraft = await inventoryTransformer({ sku: 'sku', inventory: '100;200' });
    expect(storeDraft).toEqual(
      expect.arrayContaining([
        { key: 'inventory-sku', quantityOnStock: 100, sku: 'sku' },
        { key: 'inventory-sku', quantityOnStock: 200, sku: 'sku' },
      ]),
    );
  });
});

describe('Test toInventory', () => {
  test('default', () => {
    const result = toInventory('sku')('100 2');
    expect(result).toEqual(
      expect.objectContaining({ key: 'inventory-sku', quantityOnStock: 100, sku: 'sku', restockableInDays: 2 }),
    );
  });

  test('default', () => {
    const result = toInventory('sku')('100 2 supplyChannel');
    expect(result).toEqual(
      expect.objectContaining({
        key: 'inventory-sku-supplyChannel',
        quantityOnStock: 100,
        sku: 'sku',
        restockableInDays: 2,
        supplyChannel: { key: 'supplyChannel', typeId: 'channel' },
      }),
    );
  });
});
