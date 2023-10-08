import { ProjectStatus } from '@prisma/client'
import { TQueryRequest } from '../../types/global.types'
import { Request } from 'express'

export type TCreateProject = {
    name: string
    description?: string
    parentId?: string
    ownerName: string
    area: number
    unit: string
    status: ProjectStatus
    address1: string
    address2?: string
    pincode: string
    // planningImages: string[]
    // siteImages?: string[]
}

export type TProjectReq = Request & {
    files?: {
        planningImages: any
        siteImages: any
    }
}

export type TImageUpload = {
    fieldname: string
    originalname: string
    encoding: string
    mimetype: string
    size: number
    bucket: string
    key: string
    acl: string
    contentType: string
    contentDisposition: string | null
    contentEncoding: string | null
    storageClass: string
    serverSideEncryption: string | null
    metadata: { fieldName: string }
    location: string
    etag: string
    versionId?: number
}

export type TUpdateProject = {
    name: string
    description?: string
    ownerName: string
    area: number
    unit: string
    status: ProjectStatus
    address1: string
    address2?: string
    pincode: string
}

export type TProjectList = TQueryRequest & {
    area?: number
    status?: ProjectStatus
}
