import prompts from 'prompts';

import { categoryTranslation } from './translateCategories';
import { channelTranslation } from './translateChannels';
import { productTranslation } from './translateProducts';
import { typesTranslation } from './translateProductTypes';
import { shippingMethodsTranslation } from './translateShippingMethods';
import { storeTranslation } from './translateStores';

enum Actions {
  CATEGORIES = 'CATEGORIES',
  CHANNELS = 'CHANNELS',
  PRODUCTS = 'PRODUCTS',
  PRODUCT_TYPES = 'PRODUCT_TYPES',
  SHIPPING_METHODS = 'SHIPPING_METHODS',
  STORES = 'STORES',
}

const questions = async () => {
  return await prompts([
    {
      type: 'multiselect',
      name: 'action',
      message: 'What do you want to translate?',
      choices: [
        { title: 'Categories', value: Actions.CATEGORIES },
        { title: 'Channels', value: Actions.CHANNELS },
        { title: 'Products', value: Actions.PRODUCTS },
        { title: 'Product Types', value: Actions.PRODUCT_TYPES },
        { title: 'Shipping Methods', value: Actions.SHIPPING_METHODS },
        { title: 'Stores', value: Actions.STORES },
      ],
    },
  ]);
};

const runner = async () => {
  const response: { action: Array<Actions> } = await questions();
  for (const item of response.action) {
    switch (item) {
      case Actions.CATEGORIES: {
        await categoryTranslation();
        break;
      }
      case Actions.CHANNELS: {
        await channelTranslation();
        break;
      }
      case Actions.PRODUCTS: {
        await productTranslation();
        break;
      }
      case Actions.PRODUCT_TYPES: {
        await typesTranslation();
        break;
      }
      case Actions.SHIPPING_METHODS: {
        await shippingMethodsTranslation();
        break;
      }
      case Actions.STORES: {
        await storeTranslation();
        break;
      }
    }
  }
};

runner().then(() => process.exit());
