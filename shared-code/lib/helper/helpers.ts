import { LocalizedString } from '@commercetools/platform-sdk';
import deburr from 'lodash.deburr';
import { translate } from './translation';
import { getProject } from '../ctp/project';

let loadedLanguages: Array<string> = new Array<string>();

export const readLanguages = async (): Promise<Array<string>> => {
  if (loadedLanguages && loadedLanguages.length > 0) {
    return loadedLanguages;
  }
  loadedLanguages = (await getProject()).languages;
  return loadedLanguages;
};

export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

export const clean = (input: string): string => {
  return deburr(input)
    .toLowerCase()
    .replaceAll(' ', '-')
    .replaceAll('_', '-')
    .replace(/[^0-9a-z-]/g, '')
    .replaceAll('--', '-');
};

export const cleanLocalizedStringForSlug = (name: LocalizedString, languages: Array<string>) => {
  return languages.reduce<LocalizedString>((a, v) => {
    if (name[v]) {
      return { ...a, [v]: clean(name[v]) };
    }

    return { ...a };
  }, {});
};

export function formatRowAsLocalizedString<T>(from: T, key: string, languages: Array<string>): LocalizedString {
  return languages.reduce((previousValue, language) => {
    const value = from[(key + '_' + language) as keyof typeof from];
    if (value !== '' && value !== undefined) {
      return { ...previousValue, [language]: value };
    }
    return { ...previousValue };
  }, {});
}

export const formatCategoryLocalizedSlug = async (
  name: LocalizedString,
  languages: Array<string>,
): Promise<LocalizedString> => {
  return languages.reduce((a, v) => {
    const possibleSlug = clean(name[v]);
    if (name[v] && possibleSlug && possibleSlug.length > 0 && possibleSlug !== '-') {
      return { ...a, [v]: possibleSlug };
    } else {
      const originalVersion =
        name['en-GB'] ||
        Object.entries(name)
          .map(([, value]) => {
            const slug = clean(value);
            if (slug && slug.length > 0) {
              return slug;
            }
            return undefined;
          })
          .filter(notEmpty)[0];
      return { ...a, [v]: clean(originalVersion) };
    }
  }, {});
};

const localeFallback = ['en-GB', 'en-US', 'en-CA', 'en-AU', 'en'];

export const findBestMatching = (input: LocalizedString | undefined) => {
  if (!input) {
    return undefined;
  }
  return localeFallback.reduce<{ locale: string; value: string } | undefined>((previousValue, currentValue) => {
    if (!previousValue && input[currentValue]) {
      return { locale: currentValue, value: input[currentValue] };
    }
    return previousValue;
  }, undefined);
};

export const fillMissingLanguages = async (
  from: LocalizedString | undefined,
  languages: Array<string>,
  fallback?: LocalizedString,
): Promise<LocalizedString> => {
  if (!from) {
    return {};
  }
  return await languages.reduce(async (promise, language) => {
    return promise.then(async (last) => {
      const value = from[language];
      const result = { ...last };
      if (value !== '' && value !== undefined) {
        return { ...last, [language]: value };
      }
      const source = findBestMatching(from);
      if (source) {
        const translated = await translate(source.value, source.locale.substring(0, 2), language.substring(0, 2));
        return { ...last, [language]: translated };
      } else if (fallback && fallback[language]) {
        return { ...last, [language]: fallback[language] };
      }
      return result;
    });
  }, Promise.resolve({}));
};
