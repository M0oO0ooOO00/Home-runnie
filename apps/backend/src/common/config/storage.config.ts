import * as process from 'node:process';

export default () => ({
  storage: {
    aws: {
      region: process.env.AWS_REGION ?? '',
      bucket: process.env.AWS_S3_BUCKET ?? '',
      publicBaseUrl: process.env.AWS_S3_PUBLIC_BASE_URL ?? '',
    },
  },
});
