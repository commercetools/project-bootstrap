import { AttributeType, ProductType } from '@commercetools/platform-sdk';
import { fillMissingLanguages } from '../helpers';

export const resolveMappedType = async (attributeType: AttributeType, offset: string, languages: Array<string>) => {
  let result = `${offset}name = "${attributeType.name}"\n`;
  switch (attributeType.name) {
    case 'lenum':
      attributeType.values;
      for (const value of attributeType.values) {
        const localizedString = await fillMissingLanguages(value.label, languages);
        result += `${offset}localized_value {
${offset}  key   = "${value.key}"
${offset}  label = {\n`;
        for (const [locale, value] of Object.entries(localizedString)) {
          result += `${offset}    ${locale} = "${value}",\n`;
        }
        result += `                }
            }
`;
      }

      break;
    case 'set':
      switch (attributeType.elementType.name) {
        case 'reference':
          result += `${offset}element_type {
        name = "reference"
        reference_type_id = "${attributeType.elementType.referenceTypeId}"
      }
`;
          break;
        case 'ltext':
          result += `${offset}element_type {\n${offset}  name = "ltext"\n${offset}}\n`;
          break;
        default:
          console.log('Define mapper for attribute set type ' + attributeType.elementType.name, attributeType);
      }

      break;
  }
  return result;
};

export const handleProductType = async (productType: ProductType, languages: Array<string>) => {
  if (!productType.key) {
    console.log('Skipping product type ' + productType.name + ' because of missing key');
    return;
  }
  let result = '';
  result += `resource "commercetools_product_type" "${productType.key}" {
  name        = "${productType.name}"
  description = "${productType.description}"
  key         = "${productType.key}"
`;

  if (productType.attributes) {
    for (const attribute of productType.attributes) {
      result += `
  attribute {
    name = "${attribute.name}"\n`;
      const localizedString = await fillMissingLanguages(attribute.label, languages);
      if (localizedString && Object.keys(localizedString).length > 0) {
        result += '    label = {\n';
        for (const [locale, value] of Object.entries(localizedString)) {
          result += `      ${locale} = "${value}",\n`;
        }
        result += '    }\n';
      }
      result += `    required = ${attribute.isRequired}\n`;
      result += '    type {\n';
      result += await resolveMappedType(attribute.type, '      ', languages);
      result += '    }\n';
      result += `    constraint = "${attribute.attributeConstraint}"\n`;
      result += `    searchable = ${attribute.isSearchable}\n`;
      result += `    input_hint = "${attribute.inputHint}"`;
      result += `
  }
`;
    }
  }

  result += '}\n';
  return result;
};
