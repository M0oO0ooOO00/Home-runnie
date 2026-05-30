import * as process from 'node:process';

export default () => ({
  storage: {
    azure: {
      connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING ?? '',
      container: process.env.AZURE_STORAGE_CONTAINER ?? '',
      publicBaseUrl: process.env.AZURE_STORAGE_PUBLIC_BASE_URL ?? '',
    },
  },
});
