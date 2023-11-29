import { LocalizedString } from '@commercetools/platform-sdk';
import { StringMap } from '../export/exportService';

export const addLocalizedString = (
  localizedString: LocalizedString | undefined,
  row: StringMap,
  name: string,
  obsoleteLocales?: Array<string>,
) => {
  if (localizedString) {
    for (const [locale, value] of Object.entries(localizedString)) {
      const isLocaleInBlockList = obsoleteLocales?.find((value) => value === locale);
      if (isLocaleInBlockList === undefined) {
        row[name + '_' + locale] = value;
      }
    }
  }
};
