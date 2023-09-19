import { ContactUsStatus, ProjectStatus } from '@prisma/client'
import { Request } from 'express'

export type TContactUs = {
    name: string
    email?: string
    number: string
    subject: string
    message: string
}

export type TFetchContactUsListReq = Request & {
    query: {
        status: ContactUsStatus
    }
}

export type TFetchAllProjectsReq = Request & {
    query: {
        status: ProjectStatus
    }
}
