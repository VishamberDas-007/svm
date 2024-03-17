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
    CUSTOMER_E_0003,
    CUSTOMER_S_0001,
    CUSTOMER_S_0002,
    CUSTOMER_S_0003,
    CUSTOMER_S_0004,
    CUSTOMER_S_0005,
    CUSTOMER_S_0006,
    CUSTOMER_S_0007,
    CUSTOMER_S_0008,
    CUSTOMER_S_0009,
} from '../config/responseCodes/customer'
import { Customer } from '@prisma/client'
import { TListData } from '../types/global.types'
import { TImageUpload } from './types/project'
import { deleteImage } from '../aws/s3'

export const newCustomer = catchAsync(
    async (req: TCustomerRequest, res: Response) => {
        await validator(validation.createCustomerValidator, req.body)

        const {
            aadharNo,
            name,
            email,
            phone1,
            phone2,
            city,
            pincode,
            state,
            address,
        }: TCustomer = req.body

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
                    address,
                    city: city || '',
                    pincode: pincode || '',
                    state: state || '',
                    name,
                    phone1,
                    phone2,
                    email,
                },
            })

            return responseHandler(res, CUSTOMER_S_0001, createCustomer)
        }
    }
)

export const uploadPanImage = catchAsync(
    async (req: TCustomerRequest, res: Response) => {
        await validator(validation.customerIdValidator, req.params)

        const { customerId } = req.params

        const imageUrl = req.file?.location

        const panImage = await prisma.customerImage.create({
            data: {
                type: 'PAN',
                imageUrl,
                customerId,
            },
        })

        return responseHandler(res, CUSTOMER_S_0005, panImage)
    }
)

export const uploadAadharImage = catchAsync(
    async (req: TCustomerRequest, res: Response) => {
        await validator(validation.customerIdValidator, req.params)

        const { customerId } = req.params

        const aadharFrontImageUrl = req.files?.['aadharImageFront']?.map(
            (image: TImageUpload) => ({
                imageUrl: image.location,
                type: 'AADHAR_FRONT',
                customerId,
            })
        )

        const aadharRearImageUrl = req.files?.['aadharImageRear']?.map(
            (image: TImageUpload) => ({
                imageUrl: image.location,
                type: 'AADHAR_REAR',
                customerId,
            })
        )

        const aadharImages = await prisma.customerImage.createMany({
            data: [...aadharFrontImageUrl, ...aadharRearImageUrl],
        })

        return responseHandler(res, CUSTOMER_S_0006, aadharImages)
    }
)

export const uploadCustomerImage = catchAsync(
    async (req: TCustomerRequest, res: Response) => {
        await validator(validation.customerIdValidator, req.params)

        const { customerId } = req.params

        const customerImageUrls = req.files?.['customerImage']?.map(
            (image: TImageUpload) => ({
                imageUrl: image.location,
                type: 'PHOTO',
                customerId,
            })
        )

        const customerImages = await prisma.customerImage.createMany({
            data: customerImageUrls,
        })

        return responseHandler(res, CUSTOMER_S_0007, customerImages)
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
                where: {
                    ...whereClause,
                    isDelete: false,
                },
            })
        )?.map((customer) => {
            return {
                customerId: customer.customerId,
                name: customer.name,
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
                        name: {
                            startsWith: searchString,
                            mode: 'insensitive',
                        },
                    },
                    {
                        name: {
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
                where: {
                    ...whereClause,
                    isDelete: false,
                },
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
            isDelete: false,
        },
        include: {
            customerImage: true,
        },
    })

    if (!fetchCustomer) throw new AppError(CUSTOMER_E_0001)

    return responseHandler(res, CUSTOMER_S_0002, fetchCustomer)
})

export const updateCustomer = catchAsync(
    async (req: TCustomerRequest, res: Response) => {
        await validator(validation.customerIdValidator, req.params)
        await validator(validation.updateCustomerValidator, req.body)
        const customerId = req.params.customerId

        const {
            aadharNo,
            name,
            email,
            phone1,
            address,
            city,
            phone2,
            pincode,
            state,
        }: TCustomer = req.body

        const fetchCustomer = await prisma.customer.findFirst({
            where: {
                customerId,
                isDelete: false,
            },
            include: {
                customerImage: true,
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
                        address,
                        city,
                        name,
                        phone1,
                        phone2,
                        pincode,
                        state,
                        email,
                    },
                    include: {
                        customerImage: true,
                    },
                })

                return responseHandler(res, CUSTOMER_S_0004, updatedCustomer)
            }
        }
    }
)

export const deleteCustomerImage = catchAsync(
    async (req: Request, res: Response) => {
        await validator(validation.customerImageIdValidator, req.params)
        const { customerImageId } = req.params

        const customerImageExist = await prisma.customerImage.findFirst({
            where: {
                customerImageId,
            },
        })

        if (!customerImageExist) throw new AppError(CUSTOMER_E_0003)

        await prisma.$transaction(async (prisma) => {
            await deleteImage(
                customerImageExist.imageUrl?.split('/')?.pop() || ''
            )

            await prisma.customerImage.delete({
                where: {
                    customerImageId,
                },
            })
        })

        return responseHandler(res, CUSTOMER_S_0008)
    }
)

export const deleteCustomer = catchAsync(
    async (req: Request, res: Response) => {
        await validator(validation.customerIdValidator, req.params)

        const { customerId } = req.params

        const customerData = await prisma.customer.findFirst({
            where: {
                customerId,
                isDelete: false,
            },
        })

        if (!customerData) throw new AppError(CUSTOMER_E_0001)

        await prisma.customer.update({
            where: {
                customerId,
            },
            data: {
                isDelete: true,
            },
        })

        return responseHandler(res, CUSTOMER_S_0009)
    }
)
