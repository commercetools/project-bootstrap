import { expect, test } from '@jest/globals';
import { addLocalizedString } from './exportHelper';

describe('Test addLocalizedString', () => {
  test('default', async () => {
    const row = {};
    addLocalizedString({ de: 'de', en: 'en' }, row, 'name');
    expect(row).toEqual(expect.objectContaining({ name_de: 'de', name_en: 'en' }));
  });

  test('remove obsolete locales', async () => {
    const row = {};
    addLocalizedString({ de: 'de', en: 'en' }, row, 'name', ['de']);
    expect(row).toEqual(expect.objectContaining({ name_en: 'en' }));
  });
});
