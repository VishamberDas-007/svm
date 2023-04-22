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
