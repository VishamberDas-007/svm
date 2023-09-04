import { Request, Response, response } from 'express'
import prisma from '../db'
import catchAsync from '../utils/catchAsync'
import responseHandler from '../utils/responseHandler'
import { TContactUs, TFetchContactUsListReq } from './types/website'
import {
    WEBSITE_S_0001,
    WEBSITE_S_0002,
    WEBSITE_S_0003,
} from '../config/responseCodes/website'
import { Festival } from '@prisma/client'
import validator from '../validations'
import * as validation from '../validations/website.validator'

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

    return responseHandler(res, WEBSITE_S_0001)
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
