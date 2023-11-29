import { ChannelUpdateAction } from '@commercetools/platform-sdk';
import { apiRoot } from './client';

export const getChannelByKey = (key: string) => {
  return apiRoot
    .channels()
    .get({ queryArgs: { where: `key="${key}"` } })
    .execute()
    .then(({ body }) => {
      return body.results[0];
    });
};

export const getChannels = async (limit: number) => {
  const { body } = await apiRoot
    .channels()
    .get({ queryArgs: { limit: limit } })
    .execute();
  return body;
};

export const updateChannels = async (id: string, version: number, actions: Array<ChannelUpdateAction>) => {
  return await apiRoot
    .channels()
    .withId({ ID: id })
    .post({ body: { version: version, actions: actions } })
    .execute();
};
