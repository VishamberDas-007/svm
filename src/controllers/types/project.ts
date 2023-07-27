import { ProjectStatus } from '@prisma/client'
import { TQueryRequest } from '../../types/global.types'

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
    planningImages: string[]
    siteImages?: string[]
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
