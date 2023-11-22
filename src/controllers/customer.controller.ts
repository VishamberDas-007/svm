import { Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import prisma from '../db'
import responseHandler from '../utils/responseHandler'
import AppError from '../utils/AppError'
import validator from '../validations'
import * as validation from '../validations/customer.validator'
import {
    TBasicListWhereClause,
    TCustomer,
    TCustomerList,
    TCustomerRequest,
} from './types/customer'
import {
    CUSTOMER_E_0001,
    CUSTOMER_E_0002,
    CUSTOMER_S_0001,
    CUSTOMER_S_0002,
    CUSTOMER_S_0003,
    CUSTOMER_S_0004,
} from '../config/responseCodes/customer'
import { Customer } from '@prisma/client'
import { TListData } from '../types/global.types'
import { TImageUpload } from './types/project'

export const newCustomer = catchAsync(
    async (req: TCustomerRequest, res: Response) => {
        await validator(validation.createCustomerValidator, req.body)

        const { aadharNo, firstName, email, lastName, phone }: TCustomer =
            req.body

        const aadharExists = await prisma.customer.findFirst({
            where: {
                aadharNo,
            },
        })

        if (aadharExists) throw new AppError(CUSTOMER_E_0002)
        else {
            const aadharImageUrls = req.files?.['aadharImages']?.map(
                (image: TImageUpload) => ({
                    imageUrl: image.location,
                    type: 'AADHAR',
                })
            )

            const panImageUrls = req.files?.['panImages']?.map(
                (image: TImageUpload) => ({
                    imageUrl: image.location,
                    type: 'PAN',
                })
            )

            const customerImageUrl = req.files?.['customerImage']?.map(
                (image: TImageUpload) => ({
                    imageUrl: image.location,
                    type: 'PHOTO',
                })
            )

            const createCustomer = await prisma.customer.create({
                data: {
                    aadharNo,
                    firstName,
                    lastName,
                    phone,
                    email,
                    customerImage: {
                        createMany: {
                            data: [
                                ...aadharImageUrls,
                                ...panImageUrls,
                                ...customerImageUrl,
                            ],
                        },
                    },
                },
                include: {
                    customerImage: true,
                },
            })

            return responseHandler(res, CUSTOMER_S_0001, createCustomer)
        }
    }
)

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
    async (req: TCustomerList, res: Response) => {
        const {
            page = 1,
            pageSize = 20,
            searchString,
        } = req.query as Record<string, string>

        const skip = (+page - 1) * +pageSize

        let fetchCustomerList: Customer[] = [],
            totalCount = 0,
            whereClause = {},
            totalQueryCount = 0

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
                            contains: searchString,
                            mode: 'insensitive',
                        },
                    },
                    {
                        phone: {
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
            fetchCustomerList = await prisma.customer.findMany({
                take: +pageSize,
                skip,
                where: whereClause,
                orderBy: {
                    createdAt: 'desc',
                },
            })

            totalCount = await prisma.customer.count()

            totalQueryCount = await prisma.customer.count({
                where: whereClause,
            })
        })

        const result: TListData<Customer> = {
            list: fetchCustomerList,
            meta: {
                totalCount,
                page: +page,
                pageSize: +pageSize,
                totalQueryCount,
            },
        }
        return responseHandler(res, CUSTOMER_S_0003, result)
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
                return responseHandler(res, CUSTOMER_S_0004, updatedCustomer)
            }
        }
    }
)
