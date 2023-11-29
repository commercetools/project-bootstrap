import { createApiBuilderFromCtpClient as createImportApiBuilderFromCtpClient } from '@commercetools/importapi-sdk';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { AuthMiddlewareOptions, ClientBuilder, HttpMiddlewareOptions } from '@commercetools/sdk-client-v2';
import fetch from 'node-fetch';
import { Config, Prefix, readConfig } from '../helper/config';

const createApiClient = () => {
  const config: Config = readConfig(Prefix.API);

  // Configure authMiddlewareOptions
  const authMiddlewareOptions: AuthMiddlewareOptions = {
    host: config.oauthHost,
    projectKey: config.projectKey,
    credentials: {
      clientId: config.clientId,
      clientSecret: config.clientSecret,
    },
    fetch: fetch,
  };

  // Configure httpMiddlewareOptions
  const httpMiddlewareOptions: HttpMiddlewareOptions = {
    host: config.host,
    fetch: fetch,
  };

  // Export the ClientBuilder
  const ctpClient = new ClientBuilder()
    .withProjectKey(config.projectKey) // .withProjectKey() is not required if the projectKey is included in authMiddlewareOptions
    .withClientCredentialsFlow(authMiddlewareOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    //.withLoggerMiddleware() // Include middleware for logging
    .build();

  return createApiBuilderFromCtpClient(ctpClient).withProjectKey({
    projectKey: config.projectKey,
  });
};

const createImportApiClient = () => {
  const { clientId, clientSecret, projectKey, oauthHost, host }: Config = readConfig(Prefix.IMPORT);

  // Configure authMiddlewareOptions
  const authMiddlewareOptions: AuthMiddlewareOptions = {
    host: oauthHost,
    projectKey: projectKey,
    credentials: {
      clientId: clientId,
      clientSecret: clientSecret,
    },
    fetch: fetch,
  };

  // Configure httpMiddlewareOptions
  const httpMiddlewareOptions: HttpMiddlewareOptions = {
    host: host,
    fetch: fetch,
  };

  // Export the ClientBuilder
  const ctpClient = new ClientBuilder()
    .withProjectKey(projectKey) // .withProjectKey() is not required if the projectKey is included in authMiddlewareOptions
    .withClientCredentialsFlow(authMiddlewareOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    //.withLoggerMiddleware() // Include middleware for logging
    .build();
  return createImportApiBuilderFromCtpClient(ctpClient).withProjectKeyValue({
    projectKey: projectKey,
  });
};

export const apiRoot = createApiClient();
export const importApiRoot = createImportApiClient();
