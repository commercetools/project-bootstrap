import { expect, test } from '@jest/globals';
import { mapToCategoryKey, taxTransformer } from './importHelperTaxStates';

describe('Test taxTransformer', () => {
  test('default', () => {
    taxTransformer({
      taxCategoryKey: 'standard',
      name: '10% incl.',
      amount: '0.1',
      includedInPrice: 'true',
      country: 'US',
      state: 'AL',
    }).then((result) => {
      expect(result).toEqual(
        expect.objectContaining({
          amount: 0.1,
          country: 'US',
          includedInPrice: true,
          name: '10% incl.',
          state: 'AL',
          taxCategoryKey: 'standard',
        }),
      );
    });
  });
});

describe('Test mapToCategoryKey', () => {
  test('default', () => {
    const result = mapToCategoryKey([
      {
        amount: 0.1,
        country: 'US',
        includedInPrice: true,
        name: '10% incl.',
        state: 'AL',
        taxCategoryKey: 'standard',
      },
      {
        amount: 0.2,
        country: 'US',
        includedInPrice: true,
        name: '10% incl.',
        state: 'CA',
        taxCategoryKey: 'standard',
      },
    ]);
    expect(result).toEqual(
      expect.objectContaining({
        standard: [
          {
            amount: 0.1,
            country: 'US',
            includedInPrice: true,
            name: '10% incl.',
            state: 'AL',
          },
          {
            amount: 0.2,
            country: 'US',
            includedInPrice: true,
            name: '10% incl.',
            state: 'CA',
          },
        ],
      }),
    );
  });
});
