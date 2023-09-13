import multer from 'multer'
import multerS3 from 'multer-s3'
import { awsConfig } from '../../config/const'

// import AWS from '../config'

// const s3 = new AWS.S3()

// // Set up Multer with Multer-S3 to handle file uploads to DigitalOcean Spaces
// export const upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: 'YOUR_SPACE_NAME', // Replace with your Space's name
//         acl: 'public-read', // Adjust ACL as needed
//         metadata: function (_req, file, cb) {
//             cb(null, { fieldName: file.fieldname })
//         },
//         key: function (_req, file, cb) {
//             cb(null, Date.now().toString() + '-' + file.originalname)
//         },
//     }),
// })

// digital ocean
/*

const express = require('express');

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
