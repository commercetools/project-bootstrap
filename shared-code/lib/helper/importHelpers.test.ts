import { expect, test } from '@jest/globals';
import { importItems, readAndTransformCSV, splitForImport } from './importHelpers';
import { formatRowAsLocalizedString } from './helpers';

describe('Test splitForImport', () => {
  test('default', () => {
    const result = splitForImport(Array.from(Array(10).keys()), 2);
    expect(result).toEqual(
      expect.arrayContaining([
        [0, 1],
        [2, 3],
        [4, 5],
        [6, 7],
        [8, 9],
      ]),
    );
  });
});

describe('Test importItems', () => {
  const importerFunction = jest.fn();
  test('default', () => {
    const toImport = Array.from(Array(30).keys());
    importItems(toImport, 'importerKey', importerFunction).then(() => {
      expect(importerFunction.mock.calls).toHaveLength(2);
    });
  });
});

describe('Test readAndTransformCSV', () => {
  console.log = jest.fn();
  test('default', async () => {
    const transform = (input: Record<string, any>): Promise<Record<string, any>> => {
      return Promise.resolve(input);
    };
    const result = await readAndTransformCSV(['./test-data/testfile.csv'], transform);
    expect(result).toEqual(
      expect.arrayContaining([
        {
          key: 'new',
          externalId: '1',
          'name_en-GB': 'New',
          'name_en-US': 'New',
          'name_de-DE': 'Neu',
        },
        {
          key: 'men',
          externalId: '2',
          'name_en-GB': 'Men',
          'name_en-US': 'Men',
          'name_de-DE': 'Männer',
        },
        {
          key: 'sale',
          externalId: '3',
          'name_en-GB': 'Sale',
          'name_en-US': 'Sale',
          'name_de-DE': 'Verkauf',
        },
      ]),
    );
  });
  test('localize name', async () => {
    const transform = async (input: Record<string, any>): Promise<Record<string, any>> => {
      const name = formatRowAsLocalizedString(input, 'name', ['en-GB', 'en-US', 'de-DE']);
      return { key: input.key, name: name, externalId: input.externalId };
    };
    const result = await readAndTransformCSV(['./test-data/testfile.csv'], transform);
    expect(result).toEqual(
      expect.arrayContaining([
        { externalId: '1', key: 'new', name: { 'de-DE': 'Neu', 'en-GB': 'New', 'en-US': 'New' } },
        { externalId: '2', key: 'men', name: { 'de-DE': 'Männer', 'en-GB': 'Men', 'en-US': 'Men' } },
        { externalId: '3', key: 'sale', name: { 'de-DE': 'Verkauf', 'en-GB': 'Sale', 'en-US': 'Sale' } },
      ]),
    );
  });
});
