import { expect, test } from '@jest/globals';
import { withCategories } from './importHelperProducts';

describe('Test withCategories', () => {
  test('default', () => {
    const createdPrice = withCategories('cat;e;go;;ry');
    expect(createdPrice).toEqual(
      expect.arrayContaining([
        { key: 'cat', typeId: 'category' },
        { key: 'e', typeId: 'category' },
        { key: 'go', typeId: 'category' },
        { key: 'ry', typeId: 'category' },
      ]),
    );
  });
});
