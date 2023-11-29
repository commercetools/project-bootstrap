import { Presets, SingleBar } from 'cli-progress';

export async function deleteItems(
  total: number,
  deleteFunction: (...arg: any[]) => any,
  amount: number,
  importType = 'items',
) {
  console.log('Deleting ' + total + ' ' + importType);
  if (total === 0) {
    return;
  }
  const importBarProgress = new SingleBar({}, Presets.shades_classic);
  let itemsToDelete = total;
  let i = 0;
  importBarProgress.start(total, i);
  while (itemsToDelete > 0) {
    await deleteFunction(amount);
    itemsToDelete -= amount;
    i += amount;
    importBarProgress.update(i);
  }
  importBarProgress.update(total);
  importBarProgress.stop();
}
