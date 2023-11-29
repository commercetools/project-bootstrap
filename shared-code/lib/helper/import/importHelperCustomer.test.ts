import { expect, test } from '@jest/globals';
import { customerTransformer, undefinedIfEmpty } from './importHelperCustomer';

describe('Test undefinedIfEmpty', () => {
  test('undefined', async () => {
    const result = undefinedIfEmpty(undefined);
    expect(result).toEqual(undefined);
  });
  test('""', async () => {
    const result = undefinedIfEmpty('');
    expect(result).toEqual(undefined);
  });
  test('string', async () => {
    const result = undefinedIfEmpty('string');
    expect(result).toEqual('string');
  });
});

describe('Test customerTransformer', () => {
  test('default', async () => {
    customerTransformer({ key: 'key', email: 'email', country: 'DE' }).then((result) => {
      expect(result).toEqual(
        expect.objectContaining({
          key: 'key',
          email: 'email',
          addresses: [
            {
              key: 'key-DE',
              country: 'DE',
              email: 'email',
            },
          ],
        }),
      );
    });
  });
});
