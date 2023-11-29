import { AssociateRoleDraft } from '@commercetools/platform-sdk';
import { apiRoot } from './client';

export const importAssociateRoles = async (associateRoles: Array<AssociateRoleDraft>) => {
  for await (const associateRole of associateRoles) {
    await apiRoot
      .associateRoles()
      .post({
        body: associateRole,
      })
      .execute()
      .then((res) => res.body);
  }
};
