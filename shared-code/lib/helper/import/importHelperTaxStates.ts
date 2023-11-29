import { TaxRateDraft } from '@commercetools/platform-sdk';
import { updateTaxCategories } from '../../ctp/tax';
import { readAndTransformCSV } from '../importHelpers';

interface TaxStateRow {
  taxCategoryKey: string;
  name: string;
  amount: string;
  includedInPrice: string;
  country: string;
  state: string;
}

interface TaxRateDraftWithCategoryKey extends TaxRateDraft {
  taxCategoryKey: string;
}

export const taxTransformer = async (row: TaxStateRow) => {
  const taxDraft: TaxRateDraftWithCategoryKey = {
    taxCategoryKey: row.taxCategoryKey,
    name: row.name,
    amount: parseFloat(row.amount),
    country: row.country,
    includedInPrice: row.includedInPrice === 'true',
    state: row.state,
  };
  return taxDraft;
};

export function mapToCategoryKey(toImport: Array<TaxRateDraftWithCategoryKey>) {
  const map: Record<string, Array<TaxRateDraft>> = {};
  toImport.forEach(({ taxCategoryKey, ...taxDraft }) => {
    if (!map[taxCategoryKey]) {
      map[taxCategoryKey] = [];
    }
    map[taxCategoryKey].push(taxDraft);
  });
  return map;
}

export const importUSStateTaxCategories = async (path: string, files: Array<string>) => {
  const promises = files.map((fileName) => readAndTransformCSV([path, fileName], taxTransformer));
  const drafts = (await Promise.all(promises)).flat();
  const mappedObject = mapToCategoryKey(drafts);
  await updateTaxCategories(mappedObject);
};
