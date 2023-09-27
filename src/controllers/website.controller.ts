import { Request, Response } from 'express'
import prisma from '../db'
import catchAsync from '../utils/catchAsync'
import responseHandler from '../utils/responseHandler'
import {
    TContactUs,
    TFetchAllProjectsReq,
    TFetchContactUsListReq,
} from './types/website'
import {
    WEBSITE_S_0001,
    WEBSITE_S_0002,
    WEBSITE_S_0003,
    WEBSITE_S_0004,
    WEBSITE_S_0005,
} from '../config/responseCodes/website'
import { Festival } from '@prisma/client'
import validator from '../validations'
import * as validation from '../validations/website.validator'
import { sendEmailToAdmin } from '../utils/nodeMailer'
import { nodeMailerCredentials } from '../config/const'

export const saveContactUs = catchAsync(async (req: Request, res: Response) => {
    await validator(validation.saveContactUsValidator, req.body)

    const { email, name, message, number, subject }: TContactUs = req.body

    await prisma.contactUs.create({
        data: {
            message,
            name,
            number,
            subject,
            email,
        },
    })

    responseHandler(res, WEBSITE_S_0001)

    const html = `${message} `
    await sendEmailToAdmin(
        email || nodeMailerCredentials.TEMP_USER_EMAIL,
        subject,
        html
    )
})

export const fetchContactUsList = catchAsync(
    async (req: TFetchContactUsListReq, res: Response) => {
        await validator(validation.statusValidator, req.query)

        const { status } = req.query
        let whereClause = {}

        if (status === 'COMPLETED') {
            whereClause = {
                status: 'COMPLETED',
            }
        } else if (status === 'PENDING') {
            whereClause = {
                status: 'PENDING',
            }
        }

        const contactUsList = await prisma.contactUs.findMany({
            where: whereClause,
            orderBy: {
                createdAt: 'desc',
            },
        })

        return responseHandler(res, WEBSITE_S_0002, contactUsList)
    }
)

export const addFestivalDetails = catchAsync(
    async (req: TFetchContactUsListReq, res: Response) => {
        await validator(validation.addFestivalValidator, req.body)

        const { description, thumbnailImg, title, url, isLatest }: Festival =
            req.body

        let newFestivalDetails: Festival | undefined

        await prisma.$transaction(async (prisma) => {
            if (isLatest) {
                await prisma.festival.updateMany({
                    data: {
                        isLatest: false,
                    },
                })
            }

            newFestivalDetails = await prisma.festival.create({
                data: {
                    description,
                    thumbnailImg,
                    title,
                    url,
                    isLatest,
                },
            })
        })

        return responseHandler(res, WEBSITE_S_0003, newFestivalDetails)
    }
)

export const fetchFestivalDetails = catchAsync(
    async (req: Request, res: Response) => {
        const festivalDetails = await prisma.festival.findFirst({
            where: {
                isLatest: true,
            },
        })

        return responseHandler(res, WEBSITE_S_0005, festivalDetails)
    }
)

export const fetchAllProjects = catchAsync(
    async (req: TFetchAllProjectsReq, res: Response) => {
        const { status } = req.query

        const projectList = await prisma.project.findMany({
            where: {
                status,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return responseHandler(res, WEBSITE_S_0004, projectList)
    }
)
