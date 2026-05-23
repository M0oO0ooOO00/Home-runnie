import * as process from 'node:process';

export default () => ({
  s3: {
    region: process.env.AWS_REGION ?? 'ap-northeast-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
    bucket: process.env.S3_BUCKET ?? '',
    publicBaseUrl: process.env.S3_PUBLIC_BASE_URL ?? '',
  },
});
