import {
  AssociateDraft,
  BaseAddress,
  BusinessUnitDraft,
  BusinessUnitKeyReference,
  BusinessUnitResourceIdentifier,
  Channel,
  CompanyDraft,
  Customer,
  CustomFieldsDraft,
  DivisionDraft,
  Store,
  StoreDraft,
  StoreKeyReference,
} from '@commercetools/platform-sdk';
import { getCustomerByKey } from '../../ctp/customer';
import { createOrGetBusinessUnit } from '../../ctp/business-units';
import { clean, fillMissingLanguages, readLanguages } from '../helpers';
import { getChannelByKey } from '../../ctp/channels';
import { createOrGetStore } from '../../ctp/stores';
import { readAndTransformCSV } from '../importHelpers';

export const resolveCustomersByKeys = async (unsplitted: string) => {
  if (unsplitted === undefined || unsplitted === '') {
    return undefined;
  }
  return await Promise.all(
    unsplitted.split(';').map(async (key) => {
      return await getCustomerByKey(key);
    }),
  );
};

const initializeAssociates = (
  organizationAdmins?: Array<Pick<Customer, 'key'>>,
  organizationBuyers?: Array<Pick<Customer, 'key'>>,
  organizationSuperUsers?: Array<Pick<Customer, 'key'>>,
): Array<AssociateDraft> | undefined => {
  const superUsers =
    organizationSuperUsers &&
    organizationSuperUsers.map((customer) => {
      const result: AssociateDraft = {
        associateRoleAssignments: [{ associateRole: { typeId: 'associate-role', key: 'super-user' } }],
        customer: { typeId: 'customer', key: customer.key },
      };
      return result;
    });
  const admins =
    organizationAdmins &&
    organizationAdmins.map((customer) => {
      const result: AssociateDraft = {
        associateRoleAssignments: [{ associateRole: { typeId: 'associate-role', key: 'admin' } }],
        customer: { typeId: 'customer', key: customer.key },
      };
      return result;
    });
  const buyers =
    organizationBuyers &&
    organizationBuyers.map((customer) => {
      const result: AssociateDraft = {
        associateRoleAssignments: [{ associateRole: { typeId: 'associate-role', key: 'buyer' } }],
        customer: { typeId: 'customer', key: customer.key },
      };
      return result;
    });

  const associates: Array<AssociateDraft> = [...(superUsers || []), ...(admins || []), ...(buyers || [])];
  return associates.length > 0 ? associates : undefined;
};

export const createBusinessUnitDraft = (
  name: string,
  address: BaseAddress,
  key: string,
  parentUnit?: BusinessUnitResourceIdentifier,
  organizationAdmins?: Array<Pick<Customer, 'key'>>,
  organizationBuyers?: Array<Pick<Customer, 'key'>>,
  organizationSuperUsers?: Array<Pick<Customer, 'key'>>,
  stores?: Array<Store>,
  custom?: CustomFieldsDraft,
): BusinessUnitDraft => {
  const businessUnitDraft = {
    name: name,
    key: clean(key),
    addresses: [
      {
        key: clean(key),
        ...address,
      },
    ],
    billingAddresses: [0],
    shippingAddresses: [0],
    contactEmail: address.email,
    associates: initializeAssociates(organizationAdmins, organizationBuyers, organizationSuperUsers),
    stores:
      stores &&
      stores?.map((store) => {
        const storeReference: StoreKeyReference = {
          typeId: 'store',
          key: store.key,
        };
        return storeReference;
      }),
    storeMode: parentUnit ? (stores ? 'Explicit' : 'FromParent') : undefined,
    custom: custom,
  };
  let businessUnitDraftResult: BusinessUnitDraft;
  if (parentUnit) {
    const divisionDraft: DivisionDraft = {
      unitType: 'Division',
      parentUnit: parentUnit,
      ...businessUnitDraft,
    };
    businessUnitDraftResult = divisionDraft;
  } else {
    const companyDraft: CompanyDraft = { unitType: 'Company', ...businessUnitDraft };
    businessUnitDraftResult = companyDraft;
  }
  return businessUnitDraftResult;
};

export const createStoreDraft = async (
  name: string,
  key: string,
  languages: Array<string>,
  distributionChannels?: Array<Pick<Channel, 'key'>>,
  supplyChannels?: Array<Pick<Channel, 'key'>>,
): Promise<StoreDraft> => {
  return {
    name: await fillMissingLanguages({ en: name }, languages),
    key: clean(key),
    languages: languages,
    distributionChannels:
      distributionChannels &&
      distributionChannels.map((channel) => {
        return { typeId: 'channel', key: channel.key };
      }),
    supplyChannels:
      supplyChannels &&
      supplyChannels.map((channel) => {
        return { typeId: 'channel', key: channel.key };
      }),
  };
};

export interface BusinessUnitCsvRow {
  key: string;
  name_en: string;
  country: string;
  parentId: string;
  admins: string;
  buyers: string;
  superUsers: string;
  custom: string;
  postalCode: string;
  streetName: string;
  streetNumber: string;
  city: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
}

export const businessUnitTransform = async (row: BusinessUnitCsvRow) => {
  let parent: BusinessUnitKeyReference | undefined = undefined;
  if (row.parentId !== undefined && row.parentId !== '') {
    parent = {
      typeId: 'business-unit',
      key: row.parentId,
    };
  }
  const address: BaseAddress = {
    country: row.country,
    postalCode: row.postalCode,
    streetName: row.streetName,
    streetNumber: row.streetNumber,
    city: row.city,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    company: row.company,
  };

  let custom: CustomFieldsDraft | undefined = undefined;
  if (row.custom || row.custom !== '') {
    custom = JSON.parse(row.custom);
  }

  return createBusinessUnitDraft(
    row.name_en,
    address,
    row.key,
    parent,
    await resolveCustomersByKeys(row.admins),
    await resolveCustomersByKeys(row.buyers),
    await resolveCustomersByKeys(row.superUsers),
    undefined,
    custom,
  );
};

export const importBusinessUnits = async (path: string, files: Array<string>) => {
  const promises = files.map((fileName) => readAndTransformCSV([path, fileName], businessUnitTransform));
  const languages = await readLanguages();

  const channel = await getChannelByKey('default-channel');
  const units = (await Promise.all(promises)).flat();

  for (let unit of units) {
    const store = await createOrGetStore(await createStoreDraft(unit.name, unit.key, languages, [channel], [channel]));
    const stores = [store].map((store) => {
      const result: StoreKeyReference = { typeId: 'store', key: store.key };
      return result;
    });
    if (stores.length > 0) {
      unit = {
        ...unit,
        stores: stores,
        storeMode: unit.unitType === 'Division' ? (stores.length > 0 ? 'Explicit' : 'FromParent') : 'Explicit',
      };
    }
    await createOrGetBusinessUnit(unit);
  }
};
