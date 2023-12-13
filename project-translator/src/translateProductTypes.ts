import { createSyncProductTypes } from '@commercetools/sync-actions';
import {
  fillMissingLanguages,
  getProductTypes,
  isDryRun,
  readLanguages,
  updateProductType,
} from '@commercetools-demo/shared-code';
import type { AttributeLocalizedEnumType, ProductTypeUpdateAction } from '@commercetools/platform-sdk';

const syncProductTypes = createSyncProductTypes();

export const typesTranslation = async () => {
  const productTypes = await getProductTypes();
  const languages = await readLanguages();
  let updated = 0;
  for await (const productType of productTypes.results) {
    if (!productType.attributes || productType.attributes.length === 0) {
      return;
    }
    const before = {
      name: productType.name,
      attributes: productType.attributes.map((attributeDefinition) => {
        return { label: attributeDefinition.label, inputTip: attributeDefinition.inputTip };
      }),
    };
    const nextDraft = {
      ...before,
      attributes: await Promise.all(
        productType.attributes.map(async (attributeDefinition) => {
          return {
            label: await fillMissingLanguages(attributeDefinition.label, languages),
            inputTip: await fillMissingLanguages(attributeDefinition.inputTip, languages),
          };
        }),
      ),
    };

    const actions = syncProductTypes.buildActions(nextDraft, before, {
      nestedValuesChanges: {
        attributeEnumValues: (
          await Promise.all(
            productType.attributes
              .filter((attributeDefinition) => attributeDefinition.type.name === 'lenum')
              .map(async (attribute) => {
                const type = attribute.type as AttributeLocalizedEnumType;
                return await Promise.all(
                  type.values.map(async (value) => {
                    return {
                      previous: { ...value },
                      next: {
                        ...value,
                        label: await fillMissingLanguages(value.label, languages),
                      },
                      hint: {
                        attributeName: attribute.name,
                        isLocalized: true,
                      },
                    };
                  }),
                );
              }),
          )
        ).flat(),
        attributeDefinitions: await Promise.all(
          productType.attributes.map(async (attributeDefinition) => {
            // when previous and next are defined
            // this will generate update actions for __changes__ to an attribute
            return {
              previous: {
                label: attributeDefinition.label,
                inputTip: attributeDefinition.inputTip,
                name: attributeDefinition.name,
              },
              next: {
                label: await fillMissingLanguages(attributeDefinition.label, languages),
                inputTip: await fillMissingLanguages(attributeDefinition.inputTip, languages),
                name: attributeDefinition.name,
              },
            };
          }),
        ),
      },
    });
    if (actions.length > 0) {
      updated++;
      if (isDryRun()) {
        console.log('On productType: ' + productType.name);
        actions.forEach((action) => console.log('  ', action.action, action));
      } else {
        await updateProductType(productType.id, productType.version, actions as Array<ProductTypeUpdateAction>).catch(
          (error) => {
            console.log(error.body);
          },
        );
      }
    }
  }
  console.log(`Updated ${updated} out of ${productTypes.count} product types.`);
};
