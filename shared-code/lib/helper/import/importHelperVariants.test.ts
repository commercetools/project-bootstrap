import { expect, test } from '@jest/globals';
import {
  createImageFromString,
  createImagesFromString,
  getSetAttributeValue,
  toAttribute,
} from './importHelperVariants';

describe('Test createImageFromString', () => {
  test('default', () => {
    const result = createImageFromString('image1||1x2');
    expect(result).toEqual(
      expect.objectContaining({
        dimensions: {
          h: 2,
          w: 1,
        },
        url: 'image1',
      }),
    );
  });
  test('imageonly', () => {
    const result = createImageFromString('image1');
    expect(result).toEqual(
      expect.objectContaining({
        url: 'image1',
      }),
    );
  });
});

describe('Test createImagesFromString', () => {
  test('default', () => {
    const result = createImagesFromString('image1||1x2;image2||1x2');
    expect(result).toEqual(
      expect.arrayContaining([
        {
          dimensions: {
            h: 2,
            w: 1,
          },
          url: 'image1',
        },
        {
          dimensions: {
            h: 2,
            w: 1,
          },
          url: 'image2',
        },
      ]),
    );
  });
  test('empty string', () => {
    const result = createImagesFromString('');
    expect(result).toEqual([]);
  });
});

describe('Test createImagesFromString', () => {
  test('text', async () => {
    getSetAttributeValue(
      {
        type: { name: 'set', elementType: { name: 'text' } },
        name: 'name',
        label: { en: 'label' },
        isRequired: true,
        attributeConstraint: 'None',
        inputHint: 'SingleLine',
        isSearchable: true,
      },
      'val;ue',
      ['en'],
    ).then((result) => {
      expect(result).toEqual({ name: 'name', type: 'text-set', value: ['val', 'ue'] });
    });
  });
  test('enum', () => {
    getSetAttributeValue(
      {
        type: { name: 'set', elementType: { name: 'enum', values: [] } },
        name: 'name',
        label: { en: 'label' },
        isRequired: true,
        attributeConstraint: 'None',
        inputHint: 'SingleLine',
        isSearchable: true,
      },
      'val;ue',
      ['en'],
    ).then((result) => {
      expect(result).toEqual({ name: 'name', type: 'enum-set', value: ['val', 'ue'] });
    });
  });
  test('lenum', () => {
    getSetAttributeValue(
      {
        type: { name: 'set', elementType: { name: 'lenum', values: [] } },
        name: 'name',
        label: { en: 'label' },
        isRequired: true,
        attributeConstraint: 'None',
        inputHint: 'SingleLine',
        isSearchable: true,
      },
      'val;ue',
      ['en'],
    ).then((result) => {
      expect(result).toEqual({ name: 'name', type: 'lenum-set', value: ['val', 'ue'] });
    });
  });
  test('reference', () => {
    getSetAttributeValue(
      {
        type: { name: 'set', elementType: { name: 'reference', referenceTypeId: 'product' } },
        name: 'name',
        label: { en: 'label' },
        isRequired: true,
        attributeConstraint: 'None',
        inputHint: 'SingleLine',
        isSearchable: true,
      },
      'val;ue',
      ['en'],
    ).then((result) => {
      expect(result).toEqual({
        name: 'name',
        type: 'reference-set',
        value: [
          {
            key: 'val',
            typeId: 'product',
          },
          {
            key: 'ue',
            typeId: 'product',
          },
        ],
      });
    });
  });
  test('ltext', () => {
    getSetAttributeValue(
      {
        type: { name: 'set', elementType: { name: 'ltext' } },
        name: 'name',
        label: { en: 'label' },
        isRequired: true,
        attributeConstraint: 'None',
        inputHint: 'SingleLine',
        isSearchable: true,
      },
      '[{"en":"name"}]',
      ['en'],
    ).then((result) => {
      expect(result).toEqual({
        name: 'name',
        type: 'ltext-set',
        value: [
          {
            en: 'name',
          },
        ],
      });
    });
  });
});

describe('Test toAttribute', () => {
  test('boolean', () => {
    toAttribute(
      {
        type: { name: 'boolean' },
        name: 'name',
        label: { en: 'label' },
        isRequired: true,
        attributeConstraint: 'None',
        inputHint: 'SingleLine',
        isSearchable: true,
      },
      { name: 'TRUE' },
      ['en'],
    ).then((result) => {
      expect(result).toEqual({ name: 'name', type: 'boolean', value: true });
    });
  });

  test('datetime', () => {
    toAttribute(
      {
        type: { name: 'datetime' },
        name: 'name',
        label: { en: 'label' },
        isRequired: true,
        attributeConstraint: 'None',
        inputHint: 'SingleLine',
        isSearchable: true,
      },
      { name: '2018-10-12T14:00:00.000Z' },
      ['en'],
    ).then((result) => {
      expect(result).toEqual({ name: 'name', type: 'datetime', value: '2018-10-12T14:00:00.000Z' });
    });
  });
  test('enum', () => {
    toAttribute(
      {
        type: { name: 'enum', values: [] },
        name: 'name',
        label: { en: 'label' },
        isRequired: true,
        attributeConstraint: 'None',
        inputHint: 'SingleLine',
        isSearchable: true,
      },
      { name: 'value' },
      ['en'],
    ).then((result) => {
      expect(result).toEqual({ name: 'name', type: 'enum', value: 'value' });
    });
  });
  test('lenum', () => {
    toAttribute(
      {
        type: { name: 'lenum', values: [] },
        name: 'name',
        label: { en: 'label' },
        isRequired: true,
        attributeConstraint: 'None',
        inputHint: 'SingleLine',
        isSearchable: true,
      },
      { name: 'value' },
      ['en'],
    ).then((result) => {
      expect(result).toEqual({ name: 'name', type: 'lenum', value: 'value' });
    });
  });
  test('ltext', () => {
    toAttribute(
      {
        type: { name: 'ltext' },
        name: 'name',
        label: { en: 'label' },
        isRequired: true,
        attributeConstraint: 'None',
        inputHint: 'SingleLine',
        isSearchable: true,
      },
      { name_en: 'value' },
      ['en'],
    ).then((result) => {
      expect(result).toEqual({ name: 'name', type: 'ltext', value: { en: 'value' } });
    });
  });
  test('text', () => {
    toAttribute(
      {
        type: { name: 'text' },
        name: 'name',
        label: { en: 'label' },
        isRequired: true,
        attributeConstraint: 'None',
        inputHint: 'SingleLine',
        isSearchable: true,
      },
      { name: 'value' },
      ['en'],
    ).then((result) => {
      expect(result).toEqual({ name: 'name', type: 'text', value: 'value' });
    });
  });
});
