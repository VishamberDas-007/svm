import { Request, Response } from 'express'
import prisma from '../db'
import catchAsync from '../utils/catchAsync'
import responseHandler from '../utils/responseHandler'
import { TContactUs, TFetchContactUsListReq } from './types/website'
import { WEBSITE_S_0001, WEBSITE_S_0002 } from '../config/responseCodes/website'

// !!!!!! validation is pending !!!!!!!!!!!!!!

export const saveContactUs = catchAsync(async (req: Request, res: Response) => {
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
