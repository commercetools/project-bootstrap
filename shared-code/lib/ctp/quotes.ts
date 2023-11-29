import { apiRoot } from './client';
import { DEFAULT_BATCH_SIZE } from '../helper/config';
import { deleteItems } from '../helper/deleteHelpers';

export const getQuotes = async (limit: number) => {
  const { body } = await apiRoot
    .quotes()
    .get({ queryArgs: { limit: limit } })
    .execute();
  return body;
};

export const getQuoteRequests = async (limit: number) => {
  const { body } = await apiRoot
    .quoteRequests()
    .get({ queryArgs: { limit: limit } })
    .execute();
  return body;
};

export const getStagedQuotes = async (limit: number) => {
  const { body } = await apiRoot
    .stagedQuotes()
    .get({ queryArgs: { limit: limit } })
    .execute();
  return body;
};

export const deleteQuote = async (id: string, version: number) => {
  try {
    return await apiRoot
      .quotes()
      .withId({ ID: id })
      .delete({ queryArgs: { version: version } })
      .execute();
  } catch (e) {
    console.log(e);
  }
};

export const deleteQuoteRequest = async (id: string, version: number) => {
  try {
    return await apiRoot
      .quoteRequests()
      .withId({ ID: id })
      .delete({ queryArgs: { version: version } })
      .execute();
  } catch (e) {
    console.log(e);
  }
};

export const deleteStagedQuote = async (id: string, version: number) => {
  try {
    return await apiRoot
      .stagedQuotes()
      .withId({ ID: id })
      .delete({ queryArgs: { version: version } })
      .execute();
  } catch (e) {
    console.log(e);
  }
};

const deleteQuotesBatch = async (limit: number) => {
  const toDelete = await getQuotes(limit);
  for (const item of toDelete.results) {
    await deleteQuote(item.id, item.version);
  }
};

const deleteQuoteRequestsBatch = async (limit: number) => {
  const toDelete = await getQuoteRequests(limit);
  for (const item of toDelete.results) {
    await deleteQuoteRequest(item.id, item.version);
  }
};

const deleteStagedQuotesBatch = async (limit: number) => {
  const toDelete = await getStagedQuotes(limit);
  for (const item of toDelete.results) {
    await deleteStagedQuote(item.id, item.version);
  }
};

export const deleteAllQuotes = async (batchSize = DEFAULT_BATCH_SIZE) => {
  const customers = await getQuotes(1);
  const total = customers.total || 0;
  await deleteItems(total, deleteQuotesBatch, batchSize, 'quotes');
};

export const deleteAllQuoteRequests = async (batchSize = DEFAULT_BATCH_SIZE) => {
  const quoteRequests = await getQuoteRequests(1);
  const total = quoteRequests.total || 0;
  await deleteItems(total, deleteQuoteRequestsBatch, batchSize, 'quote requests');
};

export const deleteAllStagedQuotes = async (batchSize = DEFAULT_BATCH_SIZE) => {
  const stagedQuotes = await getStagedQuotes(1);
  const total = stagedQuotes.total || 0;
  await deleteItems(total, deleteStagedQuotesBatch, batchSize, 'staged quote');
};
