import { config } from 'dotenv';

config();
config({ path: `.env.local`, override: true });

export const enum Prefix {
  API = 'CTP',
  IMPORT = 'IMPORT',
}

export const readConfig = (prefix: string) => {
  return {
    clientId: process.env[prefix + '_CLIENT_ID'] || '',
    clientSecret: process.env[prefix + '_CLIENT_SECRET'] || '',
    projectKey: process.env[prefix + '_PROJECT_KEY'] || '',
    oauthHost: process.env[prefix + '_AUTH_URL'] || '',
    host: process.env[prefix + '_API_URL'] || '',
    username: process.env[prefix + '_CUSTOMER_EMAIL'] || '',
    password: process.env[prefix + '_CUSTOMER_PASSWORD'] || '',
  };
};

export const isDryRun = (): boolean => {
  return JSON.parse(process.env['DRY_RUN'] || 'false');
};

export const isTranslationEnabled = (): boolean => {
  return JSON.parse(process.env['TRANSLATION_ENABLED'] || 'false');
};

export type Config = {
  clientId: string;
  clientSecret: string;
  projectKey: string;
  oauthHost: string;
  host: string;
  username?: string;
  password?: string;
};

export const IMPORT_STEPS = 20;
export const DEFAULT_BATCH_SIZE = 500;
