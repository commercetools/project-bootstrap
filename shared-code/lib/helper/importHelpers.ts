import fs from 'fs';
import path from 'path';
import { ClientResponse, ImportResponse } from '@commercetools/importapi-sdk';
import { Presets, SingleBar } from 'cli-progress';
import { CastingContext, Options } from 'csv-parse/lib';
import { parse } from 'csv-parse/sync';
import { IMPORT_STEPS, isDryRun } from './config';

export function splitForImport<T>(array: Array<T>, size: number) {
  const result = [];
  const arrayCopy = [...array];
  while (arrayCopy.length > 0) {
    result.push(arrayCopy.splice(0, size));
  }
  return result;
}

export async function importItems<T>(
  toImport: Array<T>,
  importerKey: string,
  importerFunction: (key: string, items: Array<T>) => Promise<ClientResponse<ImportResponse>>,
  importType = 'items',
  parallelConnections = 20,
) {
  if (isDryRun()) {
    console.log('This is just a dry run');
    console.log('About to import ' + toImport.length + ' items');
    console.log('This is the first item');
    console.log(toImport[0]);
    return;
  }
  let i = 0;
  const importBarProgress = new SingleBar({}, Presets.shades_classic);
  console.log('Importing ' + toImport.length + ' ' + importType);
  const reChunked = splitForImport(splitForImport(toImport, IMPORT_STEPS), parallelConnections);
  importBarProgress.start(reChunked.length, 0);
  while (i < reChunked.length) {
    try {
      await Promise.all(
        reChunked[i].map(async (chunk) => {
          return await importerFunction(importerKey, chunk);
        }),
      );
    } catch (error) {
      (error as any).body.errors.map(console.error);
    }
    importBarProgress.update(i + 1);
    i++;
  }
  importBarProgress.update(reChunked.length);
  importBarProgress.stop();
}

export async function readAndTransformCSV<T extends Record<string, any>, S extends Record<string, any>>(
  readFrom: Array<string>,
  transformF: (n: T) => Promise<S | undefined>,
  onRecord?: (record: any, context: CastingContext) => any,
) {
  const parserOptions: Options = {
    columns: (header) => {
      return header;
    },
    on_record: onRecord,
  };

  const input = fs.readFileSync(path.resolve(__dirname, '../../', ...readFrom));
  const records = parse(input, parserOptions);

  const result: Array<S> = [];
  for (const item of records) {
    const ele = await transformF(item);
    if (ele) {
      result.push(ele);
    }
  }

  return result;
}
