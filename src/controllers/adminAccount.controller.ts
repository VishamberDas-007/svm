import { Request, Response } from 'express'
import prisma from '../db'
import catchAsync from '../utils/catchAsync'
import responseHandler from '../utils/responseHandler'
import { TAccountDetails } from './types/adminAccount'
import validator from '../validations'
import * as validation from '../validations/adminAccount.validator'
import {
    AD_ACCOUNT_E_0001,
    AD_ACCOUNT_E_0002,
    AD_ACCOUNT_S_0001,
    AD_ACCOUNT_S_0002,
    AD_ACCOUNT_S_0003,
    AD_ACCOUNT_S_0004,
} from '../config/responseCodes/adminAccount'
import AppError from '../utils/AppError'

export const newAccount = catchAsync(async (req: Request, res: Response) => {
    await validator(validation.createAccountValidator, req.body)

    const { bankName, name, accNo }: TAccountDetails = req.body

    const accountEcists = await prisma.adminAccount.findFirst({
        where: {
            accNo,
        },
    })

    if (accountEcists) throw new AppError(AD_ACCOUNT_E_0002)
    else {
        const newAccount = await prisma.adminAccount.create({
            data: {
                bankName,
                name,
                balance: 0,
                accNo,
            },
        })

        return responseHandler(res, AD_ACCOUNT_S_0001, newAccount)
    }
})

export const getAccountDetails = catchAsync(
    async (req: Request, res: Response) => {
        await validator(validation.accountIdValidator, req.params)
        const { accountId } = req.params

        const fetchAccount = await prisma.adminAccount.findFirst({
            where: {
                adminAccountId: +accountId,
            },
        })

        if (!fetchAccount) throw new AppError(AD_ACCOUNT_E_0001)
        else return responseHandler(res, AD_ACCOUNT_S_0002, fetchAccount)
    }
)

export const getAdvanceAccountList = catchAsync(
    async (req: Request, res: Response) => {
        const fetchAccountList = await prisma.adminAccount.findMany()

        return responseHandler(res, AD_ACCOUNT_S_0003, fetchAccountList)
    }
)

export const updateAccountDetails = catchAsync(
    async (req: Request, res: Response) => {
        const { accountId } = req.params
        const { accNo, bankName, name }: TAccountDetails = req.body

        const fetchAccount = await prisma.adminAccount.findFirst({
            where: {
                adminAccountId: +accountId,
            },
        })

        if (!fetchAccount) throw new AppError(AD_ACCOUNT_E_0001)
        else {
            const updateDetails = await prisma.adminAccount.update({
                where: {
                    adminAccountId: +accountId,
                },
                data: {
                    accNo,
                    bankName,
                    name,
                },
            })

            return responseHandler(res, AD_ACCOUNT_S_0004, updateDetails)
        }
    }
)

export const getAccountBasicList = catchAsync(
    async (req: Request, res: Response) => {
        const fetchAccountList = (await prisma.adminAccount.findMany())?.map(
            (obj) => {
                return {
                    ...obj,
                    balance: undefined,
                    createdAt: undefined,
                    updatedAt: undefined,
                }
            }
        )

        return responseHandler(res, AD_ACCOUNT_S_0003, fetchAccountList)
    }
)
