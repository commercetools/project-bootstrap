import { AssociateRoleDraft } from '@commercetools/platform-sdk';
import { importAssociateRoles } from '../../ctp/associate-roles';
import { readAndTransformCSV } from '../importHelpers';

export interface AssociateRoleCsvRow {
  key: string;
  name: string;
  buyerAssignable: string;
  permissions: string;
}

export const associateRoleTransform = async (row: AssociateRoleCsvRow) => {
  const draft: AssociateRoleDraft = {
    key: row.key,
    name: row.name,
    buyerAssignable: row.buyerAssignable === 'true',
    permissions: row.permissions.split(','),
  };
  return draft;
};

export const importAssociateRole = async (path: string, files: Array<string>) => {
  const promises = files.map((fileName) => readAndTransformCSV([path, fileName], associateRoleTransform));
  const toImport = (await Promise.all(promises)).flat();
  await importAssociateRoles(toImport);
};
