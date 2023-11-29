import { expect, test } from '@jest/globals';
import { ProductType } from '@commercetools/platform-sdk';
import { handleProductType, resolveMappedType } from './exportHelperProductType';

const productType: ProductType = {
  id: 'id',
  version: 1,
  createdAt: '',
  lastModifiedAt: '',
  name: 'name',
  description: 'description',
  attributes: [
    {
      name: 'attribute-name',
      label: {
        'en-GB': 'attribute-label-en-GB',
        'de-DE': 'attribute-label-de-DE',
      },
      isRequired: false,
      type: {
        name: 'boolean',
      },
      attributeConstraint: 'None',
      isSearchable: false,
      inputHint: 'SingleLine',
    },
  ],
  key: 'key',
};

describe('Test categoryMapper', () => {
  test('ltext', async () => {
    const result = await resolveMappedType(
      {
        name: 'ltext',
      },

      '',
      [],
    );
    expect(result).toEqual(`name = "ltext"
`);
  });
  test('lenum', async () => {
    resolveMappedType(
      {
        name: 'lenum',
        values: [
          {
            key: '#FFF',
            label: {
              'de-DE': 'Weiss',
              'en-GB': 'White',
              'en-US': 'White',
            },
          },
          {
            key: '#000',
            label: {
              'de-DE': 'Schwarz',
              'en-GB': 'Black',
              'en-US': 'Black',
            },
          },
        ],
      },

      '',
      ['de-DE', 'en-GB'],
    ).then((result) => {
      expect(result).toEqual(
        `name = "lenum"
localized_value {
  key   = "#FFF"
  label = {
    de-DE = "Weiss",
    en-GB = "White",
                }
            }
localized_value {
  key   = "#000"
  label = {
    de-DE = "Schwarz",
    en-GB = "Black",
                }
            }
`,
      );
    });
  });
  test('set reference', async () => {
    resolveMappedType(
      {
        name: 'set',
        elementType: { name: 'reference', referenceTypeId: 'product' },
      },

      '',
      ['de-DE', 'en-GB'],
    ).then((result) => {
      expect(result).toEqual(
        `name = "set"
element_type {
        name = "reference"
        reference_type_id = "product"
      }
`,
      );
    });
  });
  test('set', async () => {
    resolveMappedType(
      {
        name: 'set',
        elementType: { name: 'ltext' },
      },

      '',
      ['de-DE', 'en-GB'],
    ).then((result) => {
      expect(result).toEqual(
        `name = "set"
element_type {
  name = "ltext"
}
`,
      );
    });
  });
});

describe('Test categoryMapper', () => {
  test('default', async () => {
    const result = await handleProductType(productType, ['de-DE', 'en-GB']);
    expect(result).toEqual(`resource "commercetools_product_type" "key" {
  name        = "name"
  description = "description"
  key         = "key"

  attribute {
    name = "attribute-name"
    label = {
      de-DE = "attribute-label-de-DE",
      en-GB = "attribute-label-en-GB",
    }
    required = false
    type {
      name = "boolean"
    }
    constraint = "None"
    searchable = false
    input_hint = "SingleLine"
  }
}
`);
  });

  test('no key', async () => {
    console.log = jest.fn();

    const result = await handleProductType({ ...productType, key: undefined }, ['de-DE', 'en-GB']);
    expect(result).toEqual(undefined);
  });
});
