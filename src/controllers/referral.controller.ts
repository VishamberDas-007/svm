import { Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import prisma from '../db'
import responseHandler from '../utils/responseHandler'
import AppError from '../utils/AppError'
import validator from '../validations'
import { TReferral, TReferralList } from './types/referral'
import {
    REFERRAL_E_0001,
    REFERRAL_E_0002,
    REFERRAL_S_0001,
    REFERRAL_S_0002,
    REFERRAL_S_0003,
    REFERRAL_S_0004,
} from '../config/responseCodes/referral'
import * as validation from '../validations/referral.validator'
import { Referral } from '@prisma/client'
import { TListData } from '../types/global.types'

export const newReferral = catchAsync(async (req: Request, res: Response) => {
    await validator(validation.createReferralValidator, req.body)

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
    async (req: TReferralList, res: Response) => {
        const {
            page = 1,
            pageSize = 20,
            searchString,
        } = req.query as Record<string, string>

        const skip = (+page - 1) * +pageSize

        let fetchAllReferral: Referral[] = [],
            totalCount = 0,
            whereClause = {},
            totalQueryCount = 0

        if (searchString) {
            whereClause = {
                OR: [
                    {
                        address: {
                            startsWith: searchString,
                            mode: 'insensitive',
                        },
                    },
                    {
                        address: {
                            contains: searchString,
                            mode: 'insensitive',
                        },
                    },
                    {
                        email: {
                            startsWith: searchString,
                            mode: 'insensitive',
                        },
                    },
                    {
                        email: {
                            contains: searchString,
                            mode: 'insensitive',
                        },
                    },
                    {
                        firstName: {
                            startsWith: searchString,
                            mode: 'insensitive',
                        },
                    },
                    {
                        firstName: {
                            contains: searchString,
                            mode: 'insensitive',
                        },
                    },
                    {
                        lastName: {
                            startsWith: searchString,
                            mode: 'insensitive',
                        },
                    },
                    {
                        phone: {
                            contains: searchString,
                            mode: 'insensitive',
                        },
                    },
                ],
            }
        }

        await prisma.$transaction(async (prisma) => {
            fetchAllReferral = await prisma.referral.findMany({
                take: +pageSize,
                skip,
                where: whereClause,
                orderBy: {
                    createdAt: 'desc',
                },
            })

            totalCount = await prisma.referral.count()

            totalQueryCount = await prisma.referral.count({
                where: whereClause,
            })
        })

        const result: TListData<Referral> = {
            list: fetchAllReferral,
            meta: {
                totalCount,
                page: +page,
                pageSize: +pageSize,
                totalQueryCount,
            },
        }

        return responseHandler(res, REFERRAL_S_0002, result)
    }
)

export const getReferral = catchAsync(async (req: Request, res: Response) => {
    await validator(validation.referralIdValidator, req.params)

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
        await validator(validation.updateReferralValidator, req.body)

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
            }

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
)
