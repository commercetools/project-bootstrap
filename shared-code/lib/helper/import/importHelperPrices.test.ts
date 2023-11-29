import { expect, test } from '@jest/globals';
import { createPriceFor, toPrices } from './importHelperPrices';

const productKey = 'productKey';
const sku = 'sku';
const currency = 'EUR';
const amount = 10;
const country = 'DE';
const channelKey = 'channelKey';
const customerGroupKey = 'customerGroupKey';

describe('Test createPriceFor', () => {
  test('defaultPrice', () => {
    const createdPrice = createPriceFor(productKey, sku, amount, currency);
    expect(createdPrice).toEqual(
      expect.objectContaining({
        product: {
          key: productKey,
          typeId: 'product',
        },
        key: productKey + '-' + sku + '-' + currency,
        value: {
          centAmount: amount,
          currencyCode: currency,
          type: 'centPrecision',
        },
      }),
    );
    expect(createdPrice).toEqual(
      expect.not.objectContaining({
        country: undefined,
        customerGroup: undefined,
        channel: undefined,
      }),
    );
  });

  test('withCountry', () => {
    const createdPrice = createPriceFor(productKey, sku, amount, currency, undefined, country);
    expect(createdPrice).toEqual(
      expect.objectContaining({
        country: country,
      }),
    );
  });

  test('withChannel', () => {
    const createdPrice = createPriceFor(productKey, sku, amount, currency, undefined, undefined, channelKey);
    expect(createdPrice).toEqual(
      expect.objectContaining({
        key: productKey + '-' + sku + '-' + channelKey + '-' + currency,
        channel: { typeId: 'channel', key: channelKey },
      }),
    );
  });

  test('withCustomerGroup', () => {
    const createdPrice = createPriceFor(
      productKey,
      sku,
      amount,
      currency,
      undefined,
      undefined,
      undefined,
      customerGroupKey,
    );
    expect(createdPrice).toEqual(
      expect.objectContaining({
        key: productKey + '-' + sku + '-' + customerGroupKey + '-' + currency,
        customerGroup: { typeId: 'customer-group', key: customerGroupKey },
      }),
    );
  });

  test('allPrice', () => {
    const createdPrice = createPriceFor(
      productKey,
      sku,
      amount,
      currency,
      undefined,
      country,
      channelKey,
      customerGroupKey,
    );
    expect(createdPrice).toEqual(
      expect.objectContaining({
        key: productKey + '-' + sku + '-' + channelKey + '-' + customerGroupKey + '-' + country + '-' + currency,
        customerGroup: { typeId: 'customer-group', key: customerGroupKey },
        channel: { typeId: 'channel', key: channelKey },
        country: country,
      }),
    );
  });
});

describe('Test toPrices', () => {
  test('toPricesEUR', () => {
    const createdPrice = toPrices(currency + ' ' + amount, sku, productKey);
    expect(createdPrice).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          productVariant: { key: 'sku', typeId: 'product-variant' },
          key: productKey + '-' + sku + '-' + currency,
          value: { centAmount: 10, currencyCode: currency, type: 'centPrecision' },
        }),
      ]),
    );
    expect(createdPrice.length).toEqual(8);
  });

  test('toPricesGBP', () => {
    const currency = 'GBP';
    const createdPrice = toPrices(currency + ' ' + amount, sku, productKey);
    expect(createdPrice).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          productVariant: { key: 'sku', typeId: 'product-variant' },
          key: productKey + '-' + sku + '-' + currency,
          value: { centAmount: 10, currencyCode: currency, type: 'centPrecision' },
        }),
      ]),
    );
  });
  test('all', () => {
    const createdPrice = toPrices('EUR 12999;DE-EUR 12999', sku, productKey, []);
    expect(createdPrice.length).toEqual(2);
    expect(createdPrice).toEqual(
      expect.arrayContaining([
        {
          value: { centAmount: 12999, currencyCode: 'EUR', type: 'centPrecision' },
          key: 'productKey-sku-EUR',
          productVariant: { typeId: 'product-variant', key: 'sku' },
          product: { typeId: 'product', key: 'productKey' },
        },
        {
          value: { centAmount: 12999, currencyCode: 'EUR', type: 'centPrecision' },
          key: 'productKey-sku-DE-EUR',
          productVariant: { typeId: 'product-variant', key: 'sku' },
          product: { typeId: 'product', key: 'productKey' },
          country: 'DE',
        },
      ]),
    );
  });
});
