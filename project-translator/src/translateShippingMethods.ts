import { createSyncShippingMethods } from '@commercetools/sync-actions';
import {
  formatLocalizedStringFromLocalizedString,
  readLanguages,
  getShippingMethods,
  updateShippingMethods,
  isDryRun,
} from '@commercetools-demo/shared-code';
import type { ShippingMethodUpdateAction } from '@commercetools/platform-sdk';

const syncTypes = createSyncShippingMethods();

export const shippingMethodsTranslation = async () => {
  const shippingMethods = await getShippingMethods();
  const languages = await readLanguages();
  let updated = 0;
  for await (const shippingMethod of shippingMethods.results) {
    const localizedName = shippingMethod.localizedName || { 'en-GB': shippingMethod.name };
    const before = {
      localizedName: shippingMethod.localizedName,
      localizedDescription: shippingMethod.localizedDescription,
    };
    const nextDraft = {
      ...before,
      localizedName: await formatLocalizedStringFromLocalizedString(localizedName, languages),
      localizedDescription: await formatLocalizedStringFromLocalizedString(
        shippingMethod.localizedDescription,
        languages,
      ),
    };
    const actions = syncTypes.buildActions(nextDraft, before);
    if (actions.length > 0) {
      updated++;
      if (isDryRun()) {
        console.log('On shippingMethod: ' + localizedName);
        actions.forEach((action) => console.log('  ', action.action));
      } else {
        await updateShippingMethods(
          shippingMethod.id,
          shippingMethod.version,
          actions as Array<ShippingMethodUpdateAction>,
        ).catch((error) => {
          console.log(error.body);
        });
      }
    }
  }
  console.log(`Updated ${updated} out of ${shippingMethods.count} shippment methods.`);
};
