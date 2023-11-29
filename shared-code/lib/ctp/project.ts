import { ProjectUpdateAction } from '@commercetools/platform-sdk';
import { apiRoot } from './client';

export const getProject = async () => {
  const { body } = await apiRoot.get().execute();
  return body;
};

export const updateProject = async (version: number, actions: Array<ProjectUpdateAction>) => {
  return await apiRoot.post({ body: { version: version, actions: actions } }).execute();
};
