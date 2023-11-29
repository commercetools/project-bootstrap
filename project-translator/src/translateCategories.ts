import { createSyncCategories } from '@commercetools/sync-actions';
import {
  findBestMatchingForLocalizedString,
  formatLocalizedStringFromLocalizedString,
  readLanguages,
  getCategories,
  updateCategory,
  isDryRun,
} from '@commercetools-demo/shared-code';
import type { CategoryUpdateAction } from '@commercetools/platform-sdk';
const syncTypes = createSyncCategories();

export const categoryTranslation = async () => {
  const categories = await getCategories(200);
  const languages = await readLanguages();
  let updated = 0;
  for await (const category of categories.results) {
    const before = {
      name: category.name,
      description: category.description,
    };
    const nextDraft = {
      ...before,
      name: await formatLocalizedStringFromLocalizedString(category.name, languages),
      description: await formatLocalizedStringFromLocalizedString(category.description, languages),
    };
    const actions = syncTypes.buildActions(nextDraft, before);
    if (actions.length > 0) {
      updated++;
      if (isDryRun()) {
        console.log('On category: ' + findBestMatchingForLocalizedString(category.name));
        actions.forEach((action) => console.log('  ', action.action));
      } else {
        await updateCategory(category.id, category.version, actions as Array<CategoryUpdateAction>);
      }
    }
  }
  console.log(`Updated ${updated} out of ${categories.count} categories.`);
};
