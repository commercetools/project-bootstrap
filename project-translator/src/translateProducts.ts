import { createSyncProducts } from '@commercetools/sync-actions';
import countryToCurrency from 'country-to-currency';

import {
  findBestMatchingForLocalizedString,
  formatLocalizedStringFromLocalizedString,
  getProducts,
  getProductTypes,
  getProject,
  isDryRun,
  readLanguages,
  updateProduct,
} from '@commercetools-demo/shared-code';

import type {
  Attribute,
  AttributeDefinition,
  LocalizedString,
  Price,
  PriceDraft,
  ProductType,
  ProductUpdateAction,
  ProductVariant,
} from '@commercetools/platform-sdk';

const syncTypes = createSyncProducts();

const localizeProductVariantAttribute = async (
  productVariantAttribute: Attribute,
  attributeDefinition: AttributeDefinition | undefined,
  languages: Array<string>,
) => {
  if (!attributeDefinition) {
    throw new Error('attribute definition needs to be set');
  }
  const result = { name: productVariantAttribute.name, value: productVariantAttribute.value };
  switch (attributeDefinition.type.name) {
    case 'ltext': {
      result.value = await formatLocalizedStringFromLocalizedString(productVariantAttribute.value, languages);
      break;
    }
    case 'set': {
      switch (attributeDefinition.type.elementType.name) {
        case 'ltext': {
          result.value = await Promise.all(
            productVariantAttribute.value.map((item: LocalizedString) =>
              formatLocalizedStringFromLocalizedString(item, languages),
            ),
          );
          break;
        }
      }
      break;
    }
    case 'boolean':
    case 'lenum':
      // no reason to localize anything here.
      break;
    default:
      console.log('No mapping for type ' + attributeDefinition.type.name + ' so far');
  }
  return result;
};

const priceFallback = [
  { country: 'US', currency: 'USD' },
  { country: 'GB', currency: 'GBP' },
  { country: 'DE', currency: 'EUR' },
  { currency: 'USD' },
  { currency: 'GBP' },
  { currency: 'EUR' },
];

const findSource = (input: Array<Price> | undefined) => {
  if (!input) {
    return undefined;
  }

  return priceFallback.reduce<number | undefined>((previousValue, currentValue) => {
    const found = input.find((price) => {
      if (currentValue.country && price.country) {
        return price.country === currentValue.country && price.value.currencyCode === currentValue.currency;
      }
      return price.value.currencyCode === currentValue.currency;
    });
    if (!previousValue && found) {
      return found.value.centAmount;
    }
    return previousValue;
  }, undefined);
};

const currencyCodeFromCountry = (country: string): string => {
  return (countryToCurrency as any)[country];
};

const localizeProductVariantPrices = (productVariant: ProductVariant, countries: Array<string>) => {
  const defaultPrice = findSource(productVariant.prices) || 4200;
  const newPrices: Array<PriceDraft> = [];
  for (const country of countries) {
    const currencyCode = currencyCodeFromCountry(country);
    const found = productVariant.prices?.find(
      (value) => value.country === country && value.value.currencyCode === currencyCode,
    );
    if (found) {
      const priceDraft = {
        ...found,
      };
      newPrices.push(priceDraft);
    } else {
      const priceDraft = {
        value: { currencyCode: currencyCode, centAmount: defaultPrice },
        country: country,
      };
      newPrices.push(priceDraft);
    }
  }
  return newPrices;
};

const localizeProductVariant = async (
  productVariant: ProductVariant,
  productType: ProductType | undefined,
  languages: Array<string>,
  countries: Array<string>,
) => {
  if (!productType) {
    throw new Error('Productype needs to be set');
  }
  const result = {
    id: productVariant.id,
    attributes: [],
    prices: localizeProductVariantPrices(productVariant, countries),
  };
  if (!productVariant.attributes || productVariant.attributes.length === 0) {
    return result;
  }

  return {
    ...result,
    attributes: await Promise.all(
      productVariant.attributes?.map((attribute) => {
        const attributeDefinition = productType.attributes?.find(
          (searchElement) => searchElement.name === attribute.name,
        );
        return localizeProductVariantAttribute(attribute, attributeDefinition, languages);
      }),
    ),
  };
};

export const productTranslation = async () => {
  const products = await getProducts(200, 0, ['productType']);
  const productTypes = await getProductTypes();
  const { countries } = await getProject();
  const sameForAll = new Set<string>();
  for (const productType of productTypes.results) {
    for (const attribute of productType.attributes || []) {
      if (attribute.attributeConstraint === 'SameForAll') {
        sameForAll.add(attribute.name);
      }
    }
  }
  let updated = 0;
  const languages = await readLanguages();
  for await (const product of products.results) {
    const productData = product.masterData.staged;

    const before = {
      name: productData.name,
      description: productData.description,
      masterVariant: {
        id: productData.masterVariant.id,
        attributes: productData.masterVariant.attributes,
        prices: productData.masterVariant.prices?.map((price) => {
          return { ...price };
        }),
      },
      variants: productData.variants.map((variant) => {
        return {
          id: variant.id,
          attributes: variant.attributes,
          prices: variant.prices?.map((price) => {
            return { ...price };
          }),
        };
      }),
    };
    const nextDraft = {
      ...before,
      name: await formatLocalizedStringFromLocalizedString(productData.name, languages),
      description: await formatLocalizedStringFromLocalizedString(productData.description, languages),
      masterVariant: await localizeProductVariant(
        productData.masterVariant,
        product.productType.obj,
        languages,
        countries,
      ),
      variants: await Promise.all(
        productData.variants.map((variant) =>
          localizeProductVariant(variant, product.productType.obj, languages, countries),
        ),
      ),
    };
    const actions = syncTypes.buildActions(nextDraft, before, {
      sameForAllAttributeNames: [...sameForAll],
    });
    if (actions.length > 0) {
      updated++;
      if (isDryRun()) {
        console.log('On product: ' + findBestMatchingForLocalizedString(productData.name));
        actions.forEach((action) => console.log('  ', action.action));
      } else {
        await updateProduct(product.id, product.version, actions as Array<ProductUpdateAction>).catch((error) => {
          console.log(error.body.errors);
        });
      }
    }
  }
  console.log(`Updated ${updated} out of ${products.count} products.`);
};
