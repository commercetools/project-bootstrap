import {
  Attribute,
  AttributeDefinition,
  CategoryReference,
  Product,
  ProductReference,
  ProductType,
  ProductVariant,
} from '@commercetools/platform-sdk';
import { addLocalizedString } from '../exportHelper';
import { StringMap } from '../../export/exportService';

export const categoryMapper = (category: CategoryReference) => {
  if (!category.obj?.key) {
    console.log('Key missing for category ' + category.id + ' Name: ' + category.obj?.name);
  }
  return category.obj?.key;
};

export const handleAttribute = (
  config: AttributeDefinition | undefined,
  attribute: Attribute,
  row: StringMap,
  obsoleteLocales?: Array<string>,
) => {
  switch (config?.type.name) {
    case 'ltext': {
      addLocalizedString(attribute.value, row, attribute.name, obsoleteLocales);
      break;
    }
    case 'enum':
    case 'lenum': {
      row[attribute.name] = attribute.value.key;
      break;
    }
    case 'boolean':
    case 'number':
    case 'text':
      row[attribute.name] = attribute.value;
      break;
    // case "reference":
    //   break;
    case 'set':
      switch (config.type.elementType.name) {
        case 'reference':
          row[attribute.name] = attribute.value.map((ref: ProductReference) => ref.obj?.key).join(';');
          break;
        case 'ltext':
          row[attribute.name] = JSON.stringify(attribute.value);
          break;
        default:
          console.log(config.type.elementType.name, attribute.value, attribute.name);
      }
      break;
    default:
      console.log(config?.type.name, attribute.name, attribute.value);
  }
};

export const handleVariant = (
  variant: ProductVariant,
  productTypeId: string,
  baseId: string,
  row: StringMap,
  productTypes: Array<ProductType>,
  obsoleteLocales?: Array<string>,
) => {
  row.baseId = baseId;

  variant.sku && (row['sku'] = variant.sku);
  variant.images &&
    (row['images'] = variant.images
      .map((image) => {
        return image.url + '||' + image.dimensions.w || 0 + 'x' + image.dimensions.h || 0;
      })
      .join(';'));
  variant.prices &&
    (row['baseprice'] = variant.prices
      .map((price) => {
        return (price.country ? price.country + '-' : '') + price.value.currencyCode + ' ' + price.value.centAmount;
      })
      .join(';'));
  row['inventory'] = (variant.availability?.availableQuantity || 0) + '';

  if (variant.attributes) {
    const productType = productTypes.find((pType) => pType.id === productTypeId);
    for (const attribute of variant.attributes) {
      const config = productType?.attributes?.find((attrib) => attrib.name === attribute.name);
      handleAttribute(config, attribute, row, obsoleteLocales);
    }
  }
};

export const handleProduct = (
  product: Product,
  stringMapper: StringMap,
  types: Array<ProductType>,
  obsoleteLocales?: Array<string>,
) => {
  const result: Array<StringMap> = [];
  const row: StringMap = {};
  const baseId =
    product.key ||
    product.masterData.current.masterVariant.sku?.substring(
      0,
      product.masterData.current.masterVariant.sku.indexOf('-'),
    ) ||
    '';
  addLocalizedString(product.masterData.current.name, row, 'name', obsoleteLocales);
  addLocalizedString(product.masterData.current.description, row, 'description', obsoleteLocales);
  addLocalizedString(product.masterData.current.slug, row, 'slug', obsoleteLocales);
  if (product.productType.obj?.key) {
    row['productType'] = product.productType.obj?.key;
  } else {
    console.log('Product Type does not have a key ' + product.productType.id);
  }
  if (product.taxCategory?.obj?.key) {
    const taxCategoryKey = product.taxCategory?.obj?.key;
    row['tax'] = stringMapper[taxCategoryKey] || taxCategoryKey;
  }
  row['categories'] = product.masterData.current.categories.map(categoryMapper).join(';');

  handleVariant(product.masterData.current.masterVariant, product.productType.id, baseId, row, types, obsoleteLocales);
  result.push(row);
  for (const variant of product.masterData.current.variants) {
    const mappedVariant: StringMap = {};
    handleVariant(variant, product.productType.id, baseId, mappedVariant, types, obsoleteLocales);
    result.push(mappedVariant);
  }
  return result;
};
