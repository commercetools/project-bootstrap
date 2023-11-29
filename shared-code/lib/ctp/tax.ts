import { TaxRateDraft } from '@commercetools/platform-sdk';
import { apiRoot } from './client';

const getTaxCategoryByKey = async (taxCategoryKey: string) => {
  return apiRoot
    .taxCategories()
    .withKey({ key: taxCategoryKey })
    .get()
    .execute()
    .then((res) => res.body);
};

export const updateTaxCategories = async (taxMap: Record<string, Array<TaxRateDraft>>) => {
  for await (const taxCategoryKey of Object.keys(taxMap)) {
    await getTaxCategoryByKey(taxCategoryKey).then((taxCategory) =>
      apiRoot
        .taxCategories()
        .withKey({ key: taxCategoryKey })
        .post({
          body: {
            version: taxCategory.version,
            actions: taxMap[taxCategoryKey].map((taxDraft) => ({
              action: 'addTaxRate',
              taxRate: {
                name: taxDraft.name,
                country: taxDraft.country,
                includedInPrice: taxDraft.includedInPrice,
                amount: taxDraft.amount,
                state: taxDraft.state,
              },
            })),
          },
        })
        .execute(),
    );
  }
};
