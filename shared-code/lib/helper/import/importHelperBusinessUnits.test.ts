import { expect, test } from '@jest/globals';
import { createBusinessUnitDraft, createStoreDraft } from './importHelperBusinessUnits';

const key = 'key';
const distributionsKey = 'distributionsKey';
const supplyKey = 'supplyKey';
const name = 'name';
const languages = ['en_GB', 'de_DE'];

describe('Test createStoreDraft', () => {
  test('default', async () => {
    const storeDraft = await createStoreDraft(name, key, languages);
    expect(storeDraft).toEqual(
      expect.objectContaining({
        distributionChannels: undefined,
        key: key,
        name: {
          de_DE: name,
          en_GB: name,
        },
        languages: languages,
        supplyChannels: undefined,
      }),
    );
  });
  test('with distributions channel', async () => {
    const storeDraft = await createStoreDraft(name, key, languages, [{ key: distributionsKey }]);
    expect(storeDraft).toEqual(
      expect.objectContaining({
        distributionChannels: [
          {
            key: distributionsKey,
            typeId: 'channel',
          },
        ],
        key: key,
        name: {
          de_DE: name,
          en_GB: name,
        },
        languages: languages,
        supplyChannels: undefined,
      }),
    );
  });
  test('with supply channel', async () => {
    const storeDraft = await createStoreDraft(name, key, languages, undefined, [{ key: supplyKey }]);
    expect(storeDraft).toEqual(
      expect.objectContaining({
        supplyChannels: [
          {
            key: supplyKey,
            typeId: 'channel',
          },
        ],
        key: key,
        name: {
          de_DE: name,
          en_GB: name,
        },
        languages: languages,
        distributionChannels: undefined,
      }),
    );
  });
});

describe('Test createBusinessUnitDraft', () => {
  test('default', () => {
    const storeDraft = createBusinessUnitDraft(name, { country: 'DE' }, key);

    expect(storeDraft).toEqual(
      expect.objectContaining({
        key: key,
        name: name,
        billingAddresses: [0],
        shippingAddresses: [0],
        unitType: 'Company',
        addresses: [{ key: 'key', country: 'DE' }],
      }),
    );
  });
  test('with associates', () => {
    const admin = { key: 'admin' };
    const buyer = { key: 'buyer' };
    const superUser = { key: 'superUser' };
    const storeDraft = createBusinessUnitDraft(name, { country: 'DE' }, key, undefined, [admin], [buyer], [superUser]);
    expect(storeDraft.associates).toEqual(
      expect.arrayContaining([
        {
          associateRoleAssignments: [
            {
              associateRole: {
                key: 'admin',
                typeId: 'associate-role',
              },
            },
          ],
          customer: { typeId: 'customer', key: admin.key },
        },
        {
          associateRoleAssignments: [
            {
              associateRole: {
                key: 'buyer',
                typeId: 'associate-role',
              },
            },
          ],
          customer: { typeId: 'customer', key: buyer.key },
        },
        {
          associateRoleAssignments: [
            {
              associateRole: {
                key: 'super-user',
                typeId: 'associate-role',
              },
            },
          ],
          customer: { typeId: 'customer', key: superUser.key },
        },
      ]),
    );
  });
});
