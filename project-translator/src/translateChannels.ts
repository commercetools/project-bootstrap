import { createSyncChannels } from '@commercetools/sync-actions';
import {
  findBestMatchingForLocalizedString,
  formatLocalizedStringFromLocalizedString,
  getChannels,
  isDryRun,
  readLanguages,
  updateChannels,
} from '@commercetools-demo/shared-code';
import type { ChannelUpdateAction } from '@commercetools/platform-sdk';
const syncTypes = createSyncChannels();

export const channelTranslation = async () => {
  const channels = await getChannels(200);
  const languages = await readLanguages();
  let updated = 0;
  for await (const channel of channels.results) {
    const before = {
      name: channel.name,
      description: channel.description,
    };
    const nextDraft = {
      ...before,
      name: await formatLocalizedStringFromLocalizedString(channel.name, languages),
      description: await formatLocalizedStringFromLocalizedString(channel.description, languages),
    };
    const actions = syncTypes.buildActions(nextDraft, before);
    if (actions.length > 0) {
      updated++;
      if (isDryRun()) {
        console.log('On channel: ' + findBestMatchingForLocalizedString(channel.name));
        actions.forEach((action) => console.log('  ', action.action));
      } else {
        await updateChannels(channel.id, channel.version, actions as Array<ChannelUpdateAction>);
      }
    }
  }
  console.log(`Updated ${updated} out of ${channels.count} channels.`);
};
