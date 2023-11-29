import prompts from 'prompts';
import { createOrGetImportContainer, deleteImportContainerByKey } from './import/importApi';
import { importCategories } from './helper/import/importHelperCategories';
import { importProducts } from './helper/import/importHelperProducts';
import { importProductVariants } from './helper/import/importHelperVariants';
import { importPrices } from './helper/import/importHelperPrices';
import { importInventory } from './helper/import/importHelperInventory';
import { importCustomers } from './helper/import/importHelperCustomer';
import { importAssociateRole } from './helper/import/importHelperAssociateRoles';
import { importBusinessUnits } from './helper/import/importHelperBusinessUnits';
import { deleteAllCategories } from './ctp/categories';
import { deleteAllProducts, publishAllProducts } from './ctp/products';
import { deleteAllInventory } from './ctp/inventory';
import { deleteAllCustomers } from './ctp/customer';
import { deleteAllBusinessUnits } from './ctp/business-units';
import { deleteAllOrders } from './ctp/orders';
import { deleteAllCarts } from './ctp/carts';
import { deleteAllQuoteRequests, deleteAllQuotes, deleteAllStagedQuotes } from './ctp/quotes';
import { deleteAllStores } from './ctp/stores';
import { importUSStateTaxCategories } from './helper/import/importHelperTaxStates';

export type RunnerConfig = Array<{ id: Action; path: string; fileNames: Array<string> }>;

export enum Action {
  CATEGORIES = 'Categories',
  PRODUCTS = 'Products',
  VARIANTS = 'Variants',
  PRICES = 'Prices',
  INVENTORY = 'Inventory',
  CUSTOMERS = 'Customers',
  ORDERS = 'Orders',
  CARTS = 'Carts',
  QUOTES = 'Quotes',
  STAGEDQUOTES = 'Staged Quotes',
  QUOTEREQUESTS = 'Quote Requests',
  ASSOCIATEROLES = 'Associate Roles',
  BUSINESSUNITS = 'Business Units',
  STORES = 'Stores',
  USSTATES = 'US State Taxes',
  IMPORTCONTAINERS = 'Import Containers',
}

const buildOptions = (runnerConfig: RunnerConfig, previousAction: string) => {
  if (previousAction === 'delete') {
    return [
      {
        title: Action.CATEGORIES,
        value: Action.CATEGORIES,
      },
      {
        title: Action.PRODUCTS,
        value: Action.PRODUCTS,
      },
      {
        title: Action.VARIANTS,
        value: Action.VARIANTS,
      },
      {
        title: Action.PRICES,
        value: Action.PRICES,
      },
      {
        title: Action.INVENTORY,
        value: Action.INVENTORY,
      },
      {
        title: Action.CUSTOMERS,
        value: Action.CUSTOMERS,
      },
      {
        title: Action.ORDERS,
        value: Action.ORDERS,
      },
      {
        title: Action.CARTS,
        value: Action.CARTS,
      },
      {
        title: Action.QUOTES,
        value: Action.QUOTES,
      },
      {
        title: Action.STAGEDQUOTES,
        value: Action.STAGEDQUOTES,
      },
      {
        title: Action.QUOTEREQUESTS,
        value: Action.QUOTEREQUESTS,
      },
      {
        title: Action.ASSOCIATEROLES,
        value: Action.ASSOCIATEROLES,
      },
      {
        title: Action.BUSINESSUNITS,
        value: Action.BUSINESSUNITS,
      },
      {
        title: Action.STORES,
        value: Action.STORES,
      },
      {
        title: Action.IMPORTCONTAINERS,
        value: Action.IMPORTCONTAINERS,
      },
    ];
  }
  return runnerConfig.map((value) => {
    return {
      title: value.id,
      value: value.id,
    };
  });
};

const questions = async (runnerConfig: RunnerConfig) => {
  return await prompts([
    {
      type: 'select',
      name: 'operation',
      message: 'What do you want to do?',
      choices: [
        { title: 'Import Data', value: 'import' },
        { title: 'Delete Data', value: 'delete' },
        { title: 'Publish Data', value: 'publish' },
      ],
    },
    {
      type: (prev) => (prev !== 'publish' ? 'multiselect' : null),
      name: 'actions',
      message: 'What kind of types?',
      choices: (prev) => buildOptions(runnerConfig, prev),
    },
  ]);
};

export const deleteRunner = async (actions: Array<Action>) => {
  for (const action of actions) {
    switch (action) {
      case Action.CATEGORIES: {
        await deleteAllCategories();
        break;
      }
      case Action.PRODUCTS: {
        await deleteAllProducts();
        break;
      }

      case Action.INVENTORY: {
        await deleteAllInventory();
        break;
      }
      case Action.CUSTOMERS: {
        await deleteAllCustomers();
        break;
      }
      case Action.BUSINESSUNITS: {
        await deleteAllBusinessUnits();
        break;
      }
      case Action.ORDERS: {
        await deleteAllOrders();
        break;
      }
      case Action.CARTS: {
        await deleteAllCarts();
        break;
      }
      case Action.QUOTES: {
        await deleteAllQuotes();
        break;
      }
      case Action.QUOTEREQUESTS: {
        await deleteAllQuoteRequests();
        break;
      }
      case Action.STAGEDQUOTES: {
        await deleteAllStagedQuotes();
        break;
      }
      case Action.STORES: {
        await deleteAllStores();
        break;
      }
      case Action.IMPORTCONTAINERS: {
        const importContainerPrefix = process.env['IMPORT_CONTAINER_NAME'] || 'store';
        await deleteImportContainerByKey(importContainerPrefix);
        await deleteImportContainerByKey(importContainerPrefix, 'variants');
        await deleteImportContainerByKey(importContainerPrefix, 'products');
        await deleteImportContainerByKey(importContainerPrefix, 'prices');
        await deleteImportContainerByKey(importContainerPrefix, 'inventory');
        await deleteImportContainerByKey(importContainerPrefix, 'categories');
        await deleteImportContainerByKey(importContainerPrefix, 'customer');
        break;
      }
    }
  }
};

export const importRunner = async (importRunnerConfig: RunnerConfig, actions: Array<Action>) => {
  const importContainerPrefix = process.env['IMPORT_CONTAINER_NAME'] || 'store';
  for (const action of actions) {
    const config = importRunnerConfig.find((ele) => ele.id === action);
    if (!config) {
      console.log('No config found for ' + action);
      break;
    }
    switch (action) {
      case Action.CATEGORIES: {
        const importContainer = await createOrGetImportContainer(importContainerPrefix, 'categories');
        await importCategories(importContainer.key, config.path, config.fileNames);
        break;
      }
      case Action.PRODUCTS: {
        const importContainer = await createOrGetImportContainer(importContainerPrefix, 'products');
        await importProducts(importContainer.key, config.path, config.fileNames);
        break;
      }
      case Action.VARIANTS: {
        const importContainer = await createOrGetImportContainer(importContainerPrefix, 'variants');
        await importProductVariants(importContainer.key, config.path, config.fileNames);
        break;
      }
      case Action.PRICES: {
        const importContainer = await createOrGetImportContainer(importContainerPrefix, 'prices');
        await importPrices(importContainer.key, config.path, config.fileNames);
        break;
      }
      case Action.INVENTORY: {
        const importContainer = await createOrGetImportContainer(importContainerPrefix, 'inventory');
        await importInventory(importContainer.key, config.path, config.fileNames);
        break;
      }
      case Action.CUSTOMERS: {
        const importContainer = await createOrGetImportContainer(importContainerPrefix, 'customer');
        await importCustomers(importContainer.key, config.path, config.fileNames);
        break;
      }
      case Action.ASSOCIATEROLES: {
        await importAssociateRole(config.path, config.fileNames);
        break;
      }
      case Action.BUSINESSUNITS: {
        await importBusinessUnits(config.path, config.fileNames);
        break;
      }
      case Action.USSTATES: {
        await importUSStateTaxCategories(config.path, config.fileNames);
        break;
      }
    }
  }
};
export const runner = async (runnerConfig: RunnerConfig) => {
  const { operation, actions }: { operation: string; actions: Array<Action> } = await questions(runnerConfig);

  console.log('Running ' + operation + ' for ' + actions.join(' '));
  if (operation === 'import') {
    await importRunner(runnerConfig, actions);
  } else if (operation === 'delete') {
    await deleteRunner(actions);
  } else if (operation === 'publish') {
    await publishAllProducts();
  }
};
