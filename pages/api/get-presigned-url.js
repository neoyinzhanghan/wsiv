// File: pages/api/get-presigned-url.js

import AWS from 'aws-sdk';
import 'dotenv/config';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export default async function handler(req, res) {
  const { fileName, fileType } = req.query;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Expires: 60 * 5, // URL expiration time in seconds
    ContentType: fileType,
  };

  try {
    const signedUrl = await s3.getSignedUrlPromise('putObject', params);
    res.status(200).json({ signedUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
