import {
  Attribute,
  BooleanAttribute,
  DateTimeAttribute,
  EnumAttribute,
  LocalizableEnumAttribute,
  LocalizableTextAttribute,
  TextAttribute,
  Image,
  AttributeReferenceType,
  ProductVariantImport,
} from '@commercetools/importapi-sdk';
import { AttributeDefinition, AttributeSetType, LocalizedString } from '@commercetools/platform-sdk';
import { fillMissingLanguages, formatRowAsLocalizedString, notEmpty, readLanguages } from '../helpers';
import { getProductTypeByKey } from '../../ctp/product-types';
import { importProductVariantsDrafts } from '../../import/importApi';
import { importItems, readAndTransformCSV } from '../importHelpers';

export interface VariantCsvRow {
  productType: string;
  sku: string;
  baseprice: string;
  images: string;

  baseId: string;

  masterVariant: boolean;
}
export const createImageFromString = (imageString: string): Image => {
  const [url, dimensionString] = imageString.split('||');
  const [x, y] = dimensionString ? dimensionString.split('x') : [0, 0];
  return {
    url,
    dimensions: {
      w: Number(x) || 0,
      h: Number(y) || 0,
    },
  };
};

export const createImagesFromString = (imageString: string) => {
  return imageString && imageString.length > 0
    ? imageString.split(';').map((url) => {
        return createImageFromString(url);
      })
    : [];
};

export const getSetAttributeValue = async (
  attribute: AttributeDefinition,
  value: string,
  languages: Array<string>,
): Promise<Attribute | undefined> => {
  const elementTypeName = (attribute.type as AttributeSetType).elementType.name;
  if (value === undefined || value === '') {
    return undefined;
  }

  switch (elementTypeName) {
    case 'text':
      return {
        type: 'text-set',
        name: attribute.name,
        value: value.split(';'),
      };
    case 'enum':
      return {
        type: 'enum-set',
        name: attribute.name,
        value: value.split(';'),
      };
    case 'lenum':
      return {
        type: 'lenum-set',
        name: attribute.name,
        value: value.split(';'),
      };
    case 'reference':
      return {
        type: 'reference-set',
        name: attribute.name,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        value: value.split(';').map((key) => ({
          typeId: ((attribute.type as AttributeSetType).elementType as AttributeReferenceType).referenceTypeId,
          key,
        })),
      };
    case 'ltext': {
      const values: Array<LocalizedString> = JSON.parse(value);
      return {
        type: 'ltext-set',
        name: attribute.name,
        value: await Promise.all(values.map((value) => fillMissingLanguages(value, languages))),
      };
    }
    default:
      console.log('No mapping defined for type: set ' + elementTypeName);
      break;
  }
  return undefined;
};

export async function toAttribute<T extends Record<string, any>>(
  attribute: AttributeDefinition,
  row: T,
  languages: Array<string>,
): Promise<Attribute | undefined> {
  const value = row[attribute.name as keyof T];

  switch (attribute.type.name) {
    case 'boolean': {
      const result: BooleanAttribute = {
        name: attribute.name,
        type: attribute.type.name,
        value: value === 'TRUE',
      };
      return result;
    }
    // case "boolean-set":
    //   //BooleanSetAttribute
    //   break;
    case 'date':
      //DateAttribute
      break;
    // case "date-set":
    //   //DateSetAttribute
    //   break;
    case 'datetime': {
      if (value === undefined || value === '') {
        return undefined;
      }
      const result: DateTimeAttribute = {
        name: attribute.name,
        type: attribute.type.name,
        value: value,
      };
      return result;
    }
    // case "datetime-set":
    //   //DateTimeSetAttribute
    //   break;
    case 'enum': {
      if (value === undefined || value === '') {
        return undefined;
      }
      const result: EnumAttribute = {
        name: attribute.name,
        type: attribute.type.name,
        value: value,
      };
      return result;
    }
    // case "enum-set":
    //   //EnumSetAttribute
    //   break;
    case 'lenum': {
      if (value === undefined || value === '') {
        return undefined;
      }
      const result: LocalizableEnumAttribute = {
        name: attribute.name,
        type: attribute.type.name,
        value: value,
      };
      return result;
    }
    case 'ltext': {
      const value = await fillMissingLanguages(
        formatRowAsLocalizedString(row, attribute.name || '', languages),
        languages,
      );
      if (Object.entries(value).filter(notEmpty).length === 0) {
        return undefined;
      }
      const result: LocalizableTextAttribute = {
        name: attribute.name,
        type: attribute.type.name,
        value: value,
      };
      return result;
    }
    // case "ltext-set":
    //   //LocalizableTextSetAttribute
    //   break;
    case 'money':
      //MoneyAttribute
      break;
    // case "money-set":
    //   //MoneySetAttribute
    //   break;
    case 'number':
      //NumberAttribute
      break;
    // case "number-set":
    //   //NumberSetAttribute
    //   break;
    case 'reference':
      //ReferenceAttribute
      break;
    // case "reference-set":
    //   //ReferenceSetAttribute
    //   break;
    case 'text': {
      if (value === undefined || value === '') {
        return undefined;
      }
      const result: TextAttribute = {
        name: attribute.name,
        type: attribute.type.name,
        value: value,
      };
      return result;
    }
    // case "text-set":
    //   //TextSetAttribute
    //   break;
    case 'time':
      //TimeAttribute
      break;
    // case "time-set":
    //   //TimeSetAttribute
    //   break;
    case 'set': {
      return getSetAttributeValue(attribute, value, languages);
    }
    default:
      console.log('No mapping defined for type: ' + attribute.type.name);
  }
  return undefined;
}

const productTypeKeyCache: Map<string, Array<AttributeDefinition> | undefined> = new Map<
  string,
  Array<AttributeDefinition>
>();

const loadProductTypeConfig = async (productType: string): Promise<Array<AttributeDefinition> | undefined> => {
  if (productTypeKeyCache.has(productType)) {
    return productTypeKeyCache.get(productType);
  }
  const loadedProductType = await getProductTypeByKey(productType);
  if (!loadedProductType) {
    console.error(`Cannot find product type for key: ${productType}`);
    return undefined;
  }
  const result = loadedProductType.attributes;
  productTypeKeyCache.set(productType, result);
  return result;
};

export async function createAttributesFromString<T extends Record<string, any>>(row: T, productType: string) {
  const definedAttributes = await loadProductTypeConfig(productType);
  const languages = await readLanguages();
  let attributes: Array<Attribute> | undefined = undefined;
  if (definedAttributes) {
    attributes = (
      await Promise.all(
        definedAttributes.map((attributeDefinition) => {
          return toAttribute(attributeDefinition, row, languages);
        }),
      )
    ).filter(notEmpty);
  }
  return attributes;
}
const variantFromRow = async (
  row: VariantCsvRow,
  productType: string,
  isMasterVariant: boolean,
  productKey: string,
) => {
  const productVariantDraftImport: ProductVariantImport = {
    sku: row.sku,
    key: row.sku,
    images: createImagesFromString(row.images),
    attributes: await createAttributesFromString(row, productType),
    isMasterVariant: isMasterVariant,
    product: { typeId: 'product', key: productKey },
  };
  return productVariantDraftImport;
};

let lastProductKey: string;
let lastProductType: string;
export const variantsTransformer = async (row: VariantCsvRow): Promise<ProductVariantImport> => {
  return await variantFromRow(row, row.productType, row.masterVariant, row.baseId);
};
export const variantsFilter = (record: VariantCsvRow) => {
  if (record.productType) {
    lastProductKey = record.baseId;
    lastProductType = record.productType;
    record.masterVariant = true;
  } else {
    record.baseId = lastProductKey;
    record.productType = lastProductType;
    record.masterVariant = false;
  }
  return record;
};

export const importProductVariants = async (importContainerKey: string, path: string, files: Array<string>) => {
  const promises = files.map((fileName) => readAndTransformCSV([path, fileName], variantsTransformer, variantsFilter));
  const toImport = (await Promise.all(promises)).flat();
  await importItems(toImport, importContainerKey, importProductVariantsDrafts, 'variants');
};
