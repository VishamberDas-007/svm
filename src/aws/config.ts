import AWS from 'aws-sdk'
import { awsConfig } from '../config/const'

AWS.config.update({
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey,
    region: 'us-east-1',
})

export default AWS
