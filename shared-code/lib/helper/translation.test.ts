import { expect, test } from '@jest/globals';
import { translate } from './translation';

const text = 'please translate me';
describe('Test translation', () => {
  test('using translation memory', () => {
    translate(text, 'en', 'de').then((result) => {
      expect(result).toEqual('Bitte übersetze mich');
    });
  });
  test('same language', () => {
    translate(text, 'en', 'en').then((result) => {
      expect(result).toEqual(text);
    });
  });
});
