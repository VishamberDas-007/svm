import { Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import prisma from '../db'
import responseHandler from '../utils/responseHandler'
import AppError from '../utils/AppError'
import validator from '../validations'
import { TReferral } from './types/referral'
import {
    REFERRAL_E_0001,
    REFERRAL_E_0002,
    REFERRAL_S_0001,
    REFERRAL_S_0002,
    REFERRAL_S_0003,
    REFERRAL_S_0004,
} from '../config/responseCodes/referral'
// import * as validation from '../validations/project.validator'
// import * as generalValidation from '../validations/_general.validator'
// import { TListData } from '../types/global.types'

export const newReferral = catchAsync(async (req: Request, res: Response) => {
    // await validator(validation.createProjectValidator, req.body)

    const { address, email, firstName, lastName, phone }: TReferral = req.body

    const phoneExists = await prisma.referral.findFirst({
        where: {
            phone,
        },
    })

    if (phoneExists) {
        throw new AppError(REFERRAL_E_0001)
    } else {
        const newReferral = await prisma.referral.create({
            data: {
                address,
                email,
                firstName,
                lastName,
                phone,
            },
        })

        return responseHandler(res, REFERRAL_S_0001, newReferral)
    }
})

export const getAllReferral = catchAsync(
    async (req: Request, res: Response) => {
        const fetchAllReferral = await prisma.referral.findMany()

        return responseHandler(res, REFERRAL_S_0002, fetchAllReferral)
    }
)

export const getReferral = catchAsync(async (req: Request, res: Response) => {
    const referralId = req.params.referralId

    const fetchReferral = await prisma.referral.findFirst({
        where: {
            referralId,
        },
    })

    if (!fetchReferral) {
        throw new AppError(REFERRAL_E_0002)
    } else {
        return responseHandler(res, REFERRAL_S_0003, fetchReferral)
    }
})

export const updateReferral = catchAsync(
    async (req: Request, res: Response) => {
        const referralId = req.params.referralId

        const { address, email, firstName, lastName, phone }: TReferral =
            req.body

        const fetchReferral = await prisma.referral.findFirst({
            where: {
                referralId,
            },
        })

        if (!fetchReferral) {
            throw new AppError(REFERRAL_E_0002)
        } else {
            if (phone) {
                const phoneExists = await prisma.referral.findFirst({
                    where: {
                        phone,
                        referralId: {
                            not: referralId,
                        },
                    },
                })
                if (phoneExists) throw new AppError(REFERRAL_E_0001)
            } else {
                const updateReferral = await prisma.referral.update({
                    where: {
                        referralId,
                    },
                    data: {
                        address,
                        email,
                        firstName,
                        lastName,
                        phone,
                    },
                })

                return responseHandler(res, REFERRAL_S_0004, updateReferral)
            }
        }
    }
)
