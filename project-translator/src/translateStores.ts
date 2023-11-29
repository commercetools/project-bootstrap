import { createSyncStores } from '@commercetools/sync-actions';
import {
  findBestMatchingForLocalizedString,
  formatLocalizedStringFromLocalizedString,
  getStores,
  isDryRun,
  readLanguages,
  updateStores,
} from '@commercetools-demo/shared-code';
import type { StoreUpdateAction } from '@commercetools/platform-sdk';

const syncTypes = createSyncStores();

export const storeTranslation = async () => {
  const stores = await getStores(200);
  const languages = await readLanguages();
  let updated = 0;
  for await (const store of stores.results) {
    const before = {
      name: store.name,
    };
    const nextDraft = {
      ...before,
      name: await formatLocalizedStringFromLocalizedString(store.name, languages),
    };
    const actions = syncTypes.buildActions(nextDraft, before);
    if (actions.length > 0) {
      updated++;
      if (isDryRun()) {
        console.log('On store: ' + findBestMatchingForLocalizedString(store.name));
        actions.forEach((action) => console.log('  ', action.action));
      } else {
        await updateStores(store.id, store.version, actions as Array<StoreUpdateAction>);
      }
    }
  }
  console.log(`Updated ${updated} out of ${stores.count} stores.`);
};
