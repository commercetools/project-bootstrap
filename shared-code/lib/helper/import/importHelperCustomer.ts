import { getAlpha2ByName } from 'country-locale-map';
import { CustomerAddress, CustomerImport } from '@commercetools/importapi-sdk';
import { importItems, readAndTransformCSV } from '../importHelpers';
import { importCustomerDrafts } from '../../import/importApi';

export interface CustomerCsvRow {
  key: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  email: string;
  dateOfBirth?: string;
  streetName?: string;
  streetNumber?: string;
  postalCode?: string;
  city?: string;
  country: string;
  customerGroup?: string;
}

export const undefinedIfEmpty = (input: string | undefined): string | undefined => {
  if (!input) {
    return undefined;
  }
  if (input.length === 0) {
    return undefined;
  }
  return input;
};

export const customerTransformer = async (row: CustomerCsvRow): Promise<CustomerImport> => {
  const address: CustomerAddress = {
    key: `${row.key}-${getAlpha2ByName(row.country) || 'DE'}`,
    country: getAlpha2ByName(row.country) || 'DE',
    postalCode: undefinedIfEmpty(row.postalCode),
    streetName: undefinedIfEmpty(row.streetName),
    streetNumber: undefinedIfEmpty(row.streetNumber),
    city: undefinedIfEmpty(row.city),
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
  };

  return {
    customerNumber: row.key,
    key: row.key,
    firstName: row.firstName,
    lastName: row.lastName,
    password: row.password,
    email: row.email,
    dateOfBirth: row.dateOfBirth !== undefined && row.dateOfBirth !== '' ? row.dateOfBirth : undefined,
    addresses: [address],
    customerGroup:
      row.customerGroup !== undefined && row.customerGroup !== ''
        ? { typeId: 'customer-group', key: row.customerGroup }
        : undefined,
    defaultBillingAddress: 0,
    defaultShippingAddress: 0,
    shippingAddresses: [0],
    billingAddresses: [0],
    isEmailVerified: true,
  };
};

export const importCustomers = async (importContainerKey: string, path: string, files: Array<string>) => {
  const promises = files.map((fileName) => readAndTransformCSV([path, fileName], customerTransformer));
  const toImport = (await Promise.all(promises)).flat();

  await importItems(toImport, importContainerKey, importCustomerDrafts, 'customers');
};
