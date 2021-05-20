const S3 = require("@aws-sdk/client-s3");

const REGION = 'us-west-2';

const s3Client = new S3.S3Client({
  region: REGION
});

module.exports = s3Client;