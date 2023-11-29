import { expect, test } from '@jest/globals';
import { clean, findBestMatching, formatCategoryLocalizedSlug, formatRowAsLocalizedString } from './helpers';

const name = 'name';
const languages = ['en-GB', 'de-DE'];

describe('Test formatRowAsLocalizedString', () => {
  test('default', () => {
    const localizedString = formatRowAsLocalizedString(
      { 'name_en-GB': name + '_en-GB', 'name_de-DE': name + '_de-DE' },
      name,
      languages,
    );
    expect(localizedString).toEqual(
      expect.objectContaining({
        'en-GB': 'name_en-GB',
        'de-DE': 'name_de-DE',
      }),
    );
  });
  test('with translation', () => {
    const localizedString = formatRowAsLocalizedString({ 'name_en-GB': name + '_en-GB' }, name, languages);
    expect(localizedString).toEqual(
      expect.objectContaining({
        'en-GB': 'name_en-GB',
      }),
    );
  });
});

describe('Test findBestMatching', () => {
  test('default', async () => {
    const localizedString = findBestMatching({
      'en-GB': name + '_en-GB',
      'en-US': name + '_en-US',
      en: name + '_en',
    });
    expect(localizedString).toEqual(
      expect.objectContaining({
        locale: 'en-GB',
        value: 'name_en-GB',
      }),
    );
  });
  test('fallback', async () => {
    const localizedString = findBestMatching({
      'en-US': name + '_en-US',
      en: name + '_en',
    });
    expect(localizedString).toEqual(
      expect.objectContaining({
        locale: 'en-US',
        value: 'name_en-US',
      }),
    );
  });
  test('fallback2', async () => {
    const localizedString = findBestMatching({ 'de-DE': name + '_de-DE', en: name + '_en' });
    expect(localizedString).toEqual(
      expect.objectContaining({
        locale: 'en',
        value: 'name_en',
      }),
    );
  });
});

describe('Test formatCategoryLocalizedSlug', () => {
  test('default', async () => {
    const localizedString = await formatCategoryLocalizedSlug(
      { 'en-GB': name + '_en-GB', 'de-DE': name + '_de-DE' },
      languages,
    );
    expect(localizedString).toEqual(
      expect.objectContaining({
        'de-DE': name + '-de-de',
        'en-GB': name + '-en-gb',
      }),
    );
  });
  test('without German', async () => {
    const localizedString = await formatCategoryLocalizedSlug({ 'en-GB': name + '_en-GB' }, languages);
    expect(localizedString).toEqual(
      expect.objectContaining({
        'de-DE': name + '-en-gb',
        'en-GB': name + '-en-gb',
      }),
    );
  });
});

describe('Test clean', () => {
  test('default', async () => {
    expect(clean('I am a slug')).toEqual('i-am-a-slug');
  });
  test('underscore', async () => {
    expect(clean('I_am_a_slug')).toEqual('i-am-a-slug');
  });
  test('french', async () => {
    expect(clean("Voix ambiguë d'un cœur qui, au zéphyr, préfère les jattes de kiwis.")).toEqual(
      'voix-ambigue-dun-coeur-qui-au-zephyr-prefere-les-jattes-de-kiwis',
    );
  });
});
