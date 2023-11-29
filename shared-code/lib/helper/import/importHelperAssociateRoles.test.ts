import { expect, test } from '@jest/globals';
import { AssociateRoleCsvRow, associateRoleTransform } from './importHelperAssociateRoles';

describe('Test associateRoleTransform', () => {
  test('default', async () => {
    const row: AssociateRoleCsvRow = {
      key: 'buyer',
      name: 'Buyer',
      buyerAssignable: 'true',
      permissions:
        'UpdateMyCarts,RenegotiateMyQuotes,CreateMyOrdersFromMyCarts,UpdateMyOrders,ViewMyQuotes,CreateMyOrdersFromMyQuotes,CreateMyCarts,ViewMyOrders,CreateMyQuoteRequestsFromMyCarts,AcceptMyQuotes,ViewMyCarts,ViewMyQuoteRequests,UpdateMyQuoteRequests,DeclineMyQuotes,DeleteMyCarts,UpdateOthersCarts',
    };
    const storeDraft = await associateRoleTransform(row);
    expect(storeDraft).toEqual(
      expect.objectContaining({
        buyerAssignable: true,
        key: 'buyer',
        name: 'Buyer',
        permissions: [
          'UpdateMyCarts',
          'RenegotiateMyQuotes',
          'CreateMyOrdersFromMyCarts',
          'UpdateMyOrders',
          'ViewMyQuotes',
          'CreateMyOrdersFromMyQuotes',
          'CreateMyCarts',
          'ViewMyOrders',
          'CreateMyQuoteRequestsFromMyCarts',
          'AcceptMyQuotes',
          'ViewMyCarts',
          'ViewMyQuoteRequests',
          'UpdateMyQuoteRequests',
          'DeclineMyQuotes',
          'DeleteMyCarts',
          'UpdateOthersCarts',
        ],
      }),
    );
  });
});
