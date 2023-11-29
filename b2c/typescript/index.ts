import path from 'path';
import { Action, runner, RunnerConfig } from '@commercetools-demo/shared-code';

const importRunner = async () => {
  const config: RunnerConfig = [
    {
      id: Action.CATEGORIES,
      path: path.resolve(__dirname, 'files'),
      fileNames: ['categories.csv'],
    },
    { id: Action.PRODUCTS, path: path.resolve(__dirname, 'files'), fileNames: ['products.csv'] },
    { id: Action.VARIANTS, path: path.resolve(__dirname, 'files'), fileNames: ['products.csv'] },
    { id: Action.PRICES, path: path.resolve(__dirname, 'files'), fileNames: ['products.csv'] },
    { id: Action.INVENTORY, path: path.resolve(__dirname, 'files'), fileNames: ['products.csv'] },
    { id: Action.CUSTOMERS, path: path.resolve(__dirname, 'files'), fileNames: ['customers.csv'] },
  ];
  await runner(config);
};

importRunner().then(() => process.exit());
