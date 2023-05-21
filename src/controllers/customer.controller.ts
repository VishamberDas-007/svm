import { Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import prisma from '../db'
import responseHandler from '../utils/responseHandler'
import AppError from '../utils/AppError'
import validator from '../validations'
import * as validation from '../validations/customer.validator'
import { TBasicListWhereClause, TCustomer } from './types/customer'
import {
    CUSTOMER_E_0001,
    CUSTOMER_E_0002,
    CUSTOMER_S_0001,
    CUSTOMER_S_0002,
} from '../config/responseCodes/customer'

export const newCustomer = catchAsync(async (req: Request, res: Response) => {
    await validator(validation.createCustomerValidator, req.body)

    const { aadharNo, firstName, email, lastName, phone }: TCustomer = req.body

    const aadharExists = await prisma.customer.findFirst({
        where: {
            aadharNo,
        },
    })

    if (aadharExists) throw new AppError(CUSTOMER_E_0002)
    else {
        const createCustomer = await prisma.customer.create({
            data: {
                aadharNo,
                firstName,
                lastName,
                phone,
                email,
            },
        })

        return responseHandler(res, CUSTOMER_S_0001, createCustomer)
    }
})

export const getBasicCustomerList = catchAsync(
    async (req: Request, res: Response) => {
        const searchString = req.query.searchString as string

        let whereClause: TBasicListWhereClause | undefined

        if (searchString) {
            whereClause = {
                OR: [
                    {
                        aadharNo: {
                            startsWith: searchString,
                            mode: 'insensitive',
                        },
                    },
                    {
                        aadharNo: {
                            contains: searchString,
                            mode: 'insensitive',
                        },
                    },
                ],
            }
        }

        const fetchCustomerList = (
            await prisma.customer.findMany({
                where: whereClause,
            })
        )?.map((customer) => {
            return {
                customerId: customer.customerId,
                firstName: customer.firstName,
                lastName: customer.lastName,
                aadharNo: customer.aadharNo,
            }
        })

        return responseHandler(res, CUSTOMER_S_0001, fetchCustomerList)
    }
)

export const getAdvanceCustomerList = catchAsync(
    async (req: Request, res: Response) => {
        const fetchCustomerList = await prisma.customer.findMany()

        return responseHandler(res, CUSTOMER_S_0001, fetchCustomerList)
    }
)

export const getCustomer = catchAsync(async (req: Request, res: Response) => {
    await validator(validation.customerIdValidator, req.params)
    const customerId = req.params.customerId

    const fetchCustomer = await prisma.customer.findFirst({
        where: {
            customerId,
        },
    })

    if (!fetchCustomer) throw new AppError(CUSTOMER_E_0001)
    else {
        return responseHandler(res, CUSTOMER_S_0002, fetchCustomer)
    }
})

export const updateCustomer = catchAsync(
    async (req: Request, res: Response) => {
        await validator(validation.customerIdValidator, req.params)
        await validator(validation.updateCustomerValidator, req.body)
        const customerId = req.params.customerId

        const { aadharNo, firstName, email, lastName, phone }: TCustomer =
            req.body

        const fetchCustomer = await prisma.customer.findUnique({
            where: {
                customerId,
            },
        })

        if (!fetchCustomer) throw new AppError(CUSTOMER_E_0001)
        else {
            const aadharExists = await prisma.customer.findFirst({
                where: {
                    aadharNo,
                    NOT: {
                        customerId,
                    },
                },
            })

            if (aadharExists) {
                throw new AppError(CUSTOMER_E_0002)
            } else {
                const updatedCustomer = await prisma.customer.update({
                    where: {
                        customerId,
                    },
                    data: {
                        aadharNo,
                        firstName,
                        email,
                        lastName,
                        phone,
                    },
                })
                return responseHandler(res, CUSTOMER_S_0002, updatedCustomer)
            }
        }
    }
)
