// import { AWS_CONFIG } from '../../config/const'
// import AWS from '../config'

// export const createUploadLink = async (fileName: string, folder: string) => {
//     const s3 = new AWS.S3()
//     const params = {
//         Bucket: AWS_CONFIG.s3Bucket,
//         Key: `${folder}/${fileName}`,
//         Expires: 60,
//         ContentType: 'image/jpeg',
//         ACL: 'public-read',
//     }
//     const uploadLink = await s3.getSignedUrlPromise('putObject', params)
//     return uploadLink
// }

// digital ocean
/*


const express = require('express');
const multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');

const app = express();

// Configure AWS SDK with your DigitalOcean Spaces credentials
const spacesEndpoint = new aws.Endpoint('your-space-region.digitaloceanspaces.com'); // Replace with your Space's region
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  accessKeyId: 'your-access-key', // Replace with your Spaces access key
  secretAccessKey: 'your-secret-key', // Replace with your Spaces secret key
});

// Set up a storage engine for Multer to use DigitalOcean Spaces
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'your-space-name', // Replace with your Space's name
    acl: 'public-read', // Set the ACL (Access Control List) for the uploaded files
    contentType: multerS3.AUTO_CONTENT_TYPE, // Automatically set the content type based on the file extension
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname);
    },
  }),
});



*/
