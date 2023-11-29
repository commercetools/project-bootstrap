import { expect, test } from '@jest/globals';
import { deleteItems } from './deleteHelpers';

describe('Test deleteItems', () => {
  const mockDeleteFunction = jest.fn();
  console.log = jest.fn();
  test('default', async () => {
    //five items, two to be deleted with every call --> three calls
    await deleteItems(5, mockDeleteFunction, 2);
    expect(mockDeleteFunction.mock.calls).toHaveLength(3);
    expect(mockDeleteFunction.mock.calls[0][0]).toBe(2);
  });
});
