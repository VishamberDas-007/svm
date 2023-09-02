import { Request, Response } from 'express'
import prisma from '../db'
import catchAsync from '../utils/catchAsync'
import responseHandler from '../utils/responseHandler'
import { TContactUs } from './types/website'
import { WEBSITE_S_0001, WEBSITE_S_0002 } from '../config/responseCodes/website'

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
    async (req: Request, res: Response) => {
        const contactUsList = await prisma.contactUs.findMany()

        return responseHandler(res, WEBSITE_S_0002, contactUsList)
    }
)
