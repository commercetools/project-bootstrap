import { PriceImport } from '@commercetools/importapi-sdk';
import { importPricesData } from '../../import/importApi';
import { importItems, readAndTransformCSV } from '../importHelpers';

export interface PriceDefinition {
  offset: number;
  currency: string;
  country: string | undefined;
  channelKey: string | undefined;
  customerGroupKey: string | undefined;
}

export interface ProductPriceCsvRow {
  productType: string;
  sku: string;
  baseprice: string;
  baseId: string;
}

export const createPriceFor = (
  productKey: string,
  sku: string,
  price: number,
  currency: string,
  offset = 1,
  country?: string,
  channelKey?: string,
  customerGroupKey?: string,
) => {
  const keyComponents = [productKey, sku];
  if (channelKey) {
    keyComponents.push(channelKey);
  }
  if (customerGroupKey) {
    keyComponents.push(customerGroupKey);
  }
  if (country) {
    keyComponents.push(country);
  }
  keyComponents.push(currency);
  keyComponents.join('-');

  let result: PriceImport = {
    value: {
      centAmount: Math.round(price * offset),
      currencyCode: currency,
      type: 'centPrecision',
    },
    //country: country,
    key: keyComponents.join('-'),
    productVariant: { typeId: 'product-variant', key: sku },
    product: { typeId: 'product', key: productKey },
  };
  country && (result = { ...result, country: country });
  customerGroupKey && (result = { ...result, customerGroup: { typeId: 'customer-group', key: customerGroupKey } });
  channelKey && (result = { ...result, channel: { typeId: 'channel', key: channelKey } });
  return result;
};

export const toPrices = (
  basepriceFromRow: string,
  sku: string,
  productKey: string,
  priceCalculation: Array<PriceDefinition> = [
    { offset: 1.0, currency: 'EUR', country: undefined, channelKey: undefined, customerGroupKey: undefined },
    { offset: 0.8, currency: 'EUR', country: 'DE', channelKey: undefined, customerGroupKey: undefined },
    { offset: 0.8, currency: 'EUR', country: 'IT', channelKey: undefined, customerGroupKey: undefined },
    { offset: 0.8, currency: 'GBP', country: 'GB', channelKey: undefined, customerGroupKey: undefined },
    { offset: 0.8, currency: 'EUR', country: 'FR', channelKey: undefined, customerGroupKey: undefined },
    { offset: 0.8, currency: 'EUR', country: 'PT', channelKey: undefined, customerGroupKey: undefined },
    { offset: 1.0, currency: 'USD', country: undefined, channelKey: undefined, customerGroupKey: undefined },
    { offset: 0.8, currency: 'USD', country: 'US', channelKey: undefined, customerGroupKey: undefined },
  ],
) => {
  const result: Array<PriceImport> = [];
  let baseprice = 0;

  if (basepriceFromRow.indexOf(';') >= 0) {
    basepriceFromRow.split(';').forEach((priceAsString) => {
      const [currency, price] = priceAsString.split(' ');
      if (currency.indexOf('-') >= 0) {
        const [country, currencyWithoutCountry] = currency.split('-');
        result.push(createPriceFor(productKey, sku, Number(price), currencyWithoutCountry, undefined, country));
      } else {
        result.push(createPriceFor(productKey, sku, Number(price), currency));
      }
      return;
    });
    baseprice = result[0].value.centAmount;
  } else {
    if (basepriceFromRow.indexOf(' ') >= 0) {
      const [currency, price] = basepriceFromRow.split(' ');
      result.push(createPriceFor(productKey, sku, Number(price), currency));
      baseprice = Number(price);
    } else {
      const price = basepriceFromRow.split(' ');
      result.push(createPriceFor(productKey, sku, Number(price), 'GBP'));
      baseprice = Number(price);
    }
  }

  priceCalculation.forEach((entry) => {
    const index = result.findIndex((item) => {
      return (
        item.value.currencyCode === entry.currency &&
        item.country === entry.country &&
        item.channel === entry.channelKey &&
        item.customerGroup === entry.customerGroupKey
      );
    });

    index < 0 &&
      result.push(
        createPriceFor(
          productKey,
          sku,
          baseprice,
          entry.currency,
          entry.offset,
          entry.country,
          entry.channelKey,
          entry.customerGroupKey,
        ),
      );
  });
  return result;
};

let lastProductKey: string;
export const productPriceTransformer = async (row: ProductPriceCsvRow) => {
  return toPrices(row.baseprice, row.sku, row.baseId);
};

export const productPriceFilter = (record: ProductPriceCsvRow) => {
  if (!record.baseprice) {
    return null;
  }
  if (record.productType) {
    lastProductKey = record.baseId;
  } else {
    record.baseId = lastProductKey;
  }
  return record;
};

export const importPrices = async (importContainerKey: string, path: string, files: Array<string>) => {
  const promises = files.map((fileName) =>
    readAndTransformCSV([path, fileName], productPriceTransformer, productPriceFilter),
  );
  const toImport = (await Promise.all(promises)).flat().flat();

  await importItems(toImport, importContainerKey, importPricesData, 'prices');
};
