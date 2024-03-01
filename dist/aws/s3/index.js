"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.upload = void 0;
const const_1 = require("../../config/const");
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const client_s3_1 = require("@aws-sdk/client-s3");
const s3Config = new client_s3_1.S3Client({
    region: 'blr1',
    credentials: {
        accessKeyId: const_1.awsConfig.AWS_ACCESS_KEY || '',
        secretAccessKey: const_1.awsConfig.AWS_SECRET_KEY || '',
    },
    endpoint: 'https://blr1.digitaloceanspaces.com',
});
exports.upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3Config,
        bucket: 'svm-bucket',
        acl: 'public-read',
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            const fileName = file.originalname.split('.')[0];
            const extName = file.originalname.split('.')[1];
            const timeStamp = Date.now().toString();
            const fullPath = 'svm/' + fileName + timeStamp + '.' + extName;
            cb(null, fullPath);
        },
    }),
    limits: { fileSize: 1024 * 1024 * 5 },
});
const deleteImage = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteCommand = new client_s3_1.DeleteObjectCommand({
            Bucket: 'svm-bucket',
            Key: 'svm/' + key,
        });
        yield s3Config.send(deleteCommand);
        // console.log('Deleted:', result)
    }
    catch (error) {
        console.error('Error deleting image:', error);
    }
});
exports.deleteImage = deleteImage;
