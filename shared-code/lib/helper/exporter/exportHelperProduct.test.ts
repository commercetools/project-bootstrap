import { expect, test } from '@jest/globals';
import { AttributeType } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/product-type';
import { AttributeDefinition } from '@commercetools/platform-sdk';
import { categoryMapper, handleAttribute, handleProduct, handleVariant } from './exportHelperProduct';

describe('Test categoryMapper', () => {
  test('default', async () => {
    const result = categoryMapper({
      typeId: 'category',
      id: 'id',
      obj: {
        key: 'objkey',
        id: 'id',
        version: 0,
        createdAt: '',
        lastModifiedAt: '',
        name: {},
        slug: {},
        ancestors: [],
        orderHint: '',
      },
    });
    expect(result).toEqual('objkey');
  });
});

const createAttributeDefinition = (type: AttributeType): AttributeDefinition => {
  return {
    name: 'name',
    label: {
      en: 'label',
    },
    isRequired: false,
    type: {
      ...type,
    },
    attributeConstraint: 'None',
    isSearchable: false,
    inputHint: 'SingleLine',
  };
};
describe('Test handleAttribute', () => {
  test('ltext', async () => {
    const row = {};
    handleAttribute(
      createAttributeDefinition({ name: 'ltext' }),
      {
        name: 'name',
        value: {
          en: 'value-en',
          de: 'value-de',
        },
      },
      row,
    );
    expect(row).toEqual(expect.objectContaining({ name_de: 'value-de', name_en: 'value-en' }));
  });
  test('lenum', async () => {
    const row = {};
    handleAttribute(
      createAttributeDefinition({
        name: 'lenum',
        values: [
          {
            key: 'key',
            label: {
              en: 'label',
            },
          },
        ],
      }),
      {
        name: 'name',
        value: {
          key: 'key',
        },
      },
      row,
    );
    expect(row).toEqual(expect.objectContaining({ name: 'key' }));
  });

  test('boolean', async () => {
    const row = {};
    handleAttribute(
      createAttributeDefinition({
        name: 'boolean',
      }),
      {
        name: 'name',
        value: true,
      },
      row,
    );
    expect(row).toEqual(expect.objectContaining({ name: true }));
  });

  test('text', async () => {
    const row = {};
    handleAttribute(
      createAttributeDefinition({
        name: 'text',
      }),
      {
        name: 'name',
        value: 'text',
      },
      row,
    );
    expect(row).toEqual(expect.objectContaining({ name: 'text' }));
  });
});

describe('Test handleAttribute sets', () => {
  test('ltext', async () => {
    const row = {};
    handleAttribute(
      createAttributeDefinition({ name: 'set', elementType: { name: 'ltext' } }),
      {
        name: 'name',
        value: [
          {
            en: '1-en',
            de: '1-de',
          },
          {
            en: '2-en',
            de: '2-de',
          },
        ],
      },
      row,
    );
    expect(row).toEqual(expect.objectContaining({ name: '[{"en":"1-en","de":"1-de"},{"en":"2-en","de":"2-de"}]' }));
  });

  test('reference', async () => {
    const row = {};
    handleAttribute(
      createAttributeDefinition({ name: 'set', elementType: { name: 'reference', referenceTypeId: 'product' } }),
      {
        name: 'name',
        value: [
          {
            obj: { key: '1-en' },
          },
          {
            obj: { key: '2-en' },
          },
        ],
      },
      row,
    );
    expect(row).toEqual(expect.objectContaining({ name: '1-en;2-en' }));
  });
});

describe('Test handleVariant', () => {
  test('default', async () => {
    const row = {};
    handleVariant(
      {
        id: 0,
        sku: 'sku',
        images: [
          { url: 'url1', dimensions: { w: 0, h: 0 } },
          { url: 'url2', dimensions: { w: 0, h: 0 } },
        ],
        prices: [
          {
            id: 'id',
            value: {
              type: 'centPrecision',
              currencyCode: 'EUR',
              centAmount: 123,
              fractionDigits: 2,
            },
            country: 'DE',
          },
          {
            id: 'id',
            value: {
              type: 'centPrecision',
              currencyCode: 'EUR',
              centAmount: 123,
              fractionDigits: 2,
            },
          },
        ],
        availability: {
          availableQuantity: 100,
        },
      },
      '3aef9699-0f6c-490c-815a-3f3f0dada18c',
      'baseId',
      row,
      [],
    );
    expect(row).toEqual(
      expect.objectContaining({
        baseId: 'baseId',
        sku: 'sku',
        images: 'url1||0;url2||0',
        baseprice: 'DE-EUR 123;EUR 123',
        inventory: '100',
      }),
    );
  });
});

describe('Test handleProduct', () => {
  test('default', async () => {
    const row = handleProduct(
      {
        id: '0',
        key: 'productKey',
        version: 0,
        createdAt: '',
        lastModifiedAt: '',
        productType: {
          typeId: 'product-type',
          id: 'productTypeId',
          obj: {
            name: 'productTypeName',
            id: '0',
            key: 'productTypeKey',
            version: 0,
            createdAt: '',
            lastModifiedAt: '',
            description: '',
          },
        },
        masterData: {
          published: false,
          hasStagedChanges: false,
          current: {
            name: { en: 'name' },
            description: { en: 'description' },
            slug: { en: 'slug' },
            categories: [],
            masterVariant: { id: 0 },
            variants: [],
            searchKeywords: {},
          },
          staged: {
            name: { en: 'name' },
            description: { en: 'description' },
            slug: { en: 'slug' },
            categories: [],
            masterVariant: { id: 0 },
            variants: [],
            searchKeywords: {},
          },
        },
      },
      { from: 'to' },
      [],
    );
    expect(row).toEqual(
      expect.arrayContaining([
        {
          baseId: 'productKey',
          categories: '',
          description_en: 'description',
          inventory: '0',
          name_en: 'name',
          productType: 'productTypeKey',
          slug_en: 'slug',
        },
      ]),
    );
  });
});
