import { awsConfig } from '../../config/const'
import multer from 'multer'
import multerS3 from 'multer-s3'
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'

const s3Config = new S3Client({
    region: 'blr1',
    credentials: {
        accessKeyId: awsConfig.AWS_ACCESS_KEY || '',
        secretAccessKey: awsConfig.AWS_SECRET_KEY || '',
    },
    endpoint: 'https://blr1.digitaloceanspaces.com',
})

export const upload = multer({
    storage: multerS3({
        s3: s3Config,
        bucket: 'svm-bucket',
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname })
        },
        key: function (req, file, cb) {
            const fileName = file.originalname.split('.')[0]
            const extName = file.originalname.split('.')[1]
            const timeStamp = Date.now().toString()
            const fullPath = 'svm/' + fileName + timeStamp + '.' + extName

            cb(null, fullPath)
        },
    }),
    limits: { fileSize: 1024 * 1024 * 5 },
})

export const deleteImage = async (key: string) => {
    try {
        const deleteCommand = new DeleteObjectCommand({
            Bucket: 'svm-bucket',
            Key: 'svm/' + key,
        })
        await s3Config.send(deleteCommand)
        // console.log('Deleted:', result)
    } catch (error) {
        console.error('Error deleting image:', error)
    }
}
