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
    CUSTOMER_S_0010,
} from '../config/responseCodes/customer'
import { Customer, CustomerImage, CustomerImageType } from '@prisma/client'
import { TListData } from '../types/global.types'
import { TImageUpload } from './types/project'
import { deleteImage } from '../aws/s3'

export const newCustomer = catchAsync(
    async (req: TCustomerRequest, res: Response) => {
        await validator(validation.createCustomerValidator, req.body)

        const {
            name,
            email,
            phone1,
            phone2,
            city,
            pincode,
            isMarried,
            dob,
            state,
            address,
        }: TCustomer = req.body

        const createCustomer = await prisma.customer.create({
            data: {
                address,
                city: city || '',
                pincode: pincode || '',
                state: state || '',
                name,
                phone1,
                phone2,
                dob,
                isMarried,
                email,
            },
        })

        return responseHandler(res, CUSTOMER_S_0001, createCustomer)
    }
)

export const uploadPanImage = catchAsync(
    async (req: TCustomerRequest, res: Response) => {
        await validator(validation.customerIdValidator, req.params)

        const { customerId } = req.params

        const imageUrl = req.file?.location
        let panImage: CustomerImage | undefined

        const fetchPanImage = await prisma.customerImage.findFirst({
            where: {
                customerId,
                type: 'PAN',
            },
        })

        await prisma.$transaction(async (prisma) => {
            if (fetchPanImage) {
                const key = fetchPanImage.imageUrl.split('/').pop() || ''
                await deleteImage(key)
                await prisma.customerImage.deleteMany({
                    where: {
                        customerId,
                        type: 'PAN',
                    },
                })
            }

            panImage = await prisma.customerImage.create({
                data: {
                    type: 'PAN',
                    imageUrl,
                    customerId,
                },
            })
        })
        return responseHandler(res, CUSTOMER_S_0005, panImage)
    }
)

export const uploadAadharImage = catchAsync(
    async (req: TCustomerRequest, res: Response) => {
        await validator(validation.customerIdValidator, req.params)

        const { customerId } = req.params

        const aadharFrontImageUrl =
            req.files?.['aadharImageFront']?.map((image: TImageUpload) => ({
                imageUrl: image.location,
                type: 'AADHAR_FRONT',
                customerId,
            })) || []

        const aadharRearImageUrl =
            req.files?.['aadharImageRear']?.map((image: TImageUpload) => ({
                imageUrl: image.location,
                type: 'AADHAR_REAR',
                customerId,
            })) || []

        const aadharImages = await prisma.customerImage.findMany({
            where: {
                customerId,
                type: {
                    in: ['AADHAR_REAR', 'AADHAR_FRONT'],
                },
            },
        })

        await prisma.$transaction(async (prisma) => {
            const deleteWhereClause: {
                customerId: string
                type: { in: CustomerImageType[] }
            } = {
                customerId: '',
                type: {
                    in: [],
                },
            }

            if (aadharFrontImageUrl?.length) {
                const aadharFront = aadharImages.find(
                    (obj) => obj.type === 'AADHAR_FRONT'
                )

                if (aadharFront) {
                    const key = aadharFront.imageUrl.split('/').pop() || ''
                    await deleteImage(key)
                    deleteWhereClause.customerId = customerId
                    deleteWhereClause.type?.in.push('AADHAR_FRONT')
                }
            }

            if (aadharRearImageUrl?.length) {
                const aadharRear = aadharImages.find(
                    (obj) => obj.type === 'AADHAR_REAR'
                )

                if (aadharRear) {
                    const key = aadharRear.imageUrl.split('/').pop() || ''
                    await deleteImage(key)
                    deleteWhereClause.customerId = customerId
                    deleteWhereClause.type?.in.push('AADHAR_REAR')
                }
            }

            if (deleteWhereClause.customerId) {
                await prisma.customerImage.deleteMany({
                    where: deleteWhereClause,
                })
            }

            await prisma.customerImage.createMany({
                data: [...aadharFrontImageUrl, ...aadharRearImageUrl],
            })
        })
        return responseHandler(res, CUSTOMER_S_0006, [
            ...aadharFrontImageUrl,
            ...aadharRearImageUrl,
        ])
    }
)

export const uploadCustomerImage = catchAsync(
    async (req: TCustomerRequest, res: Response) => {
        await validator(validation.customerIdValidator, req.params)

        const { customerId } = req.params
        let customerImages

        const customerImage = req.files?.['customerImage']?.map(
            (image: TImageUpload) => ({
                imageUrl: image.location,
                type: 'PHOTO',
                customerId,
            })
        )?.[0]

        const fetchCustomerImages = await prisma.customerImage.findFirst({
            where: {
                customerId,
                type: 'PHOTO',
            },
        })

        await prisma.$transaction(async (prisma) => {
            if (fetchCustomerImages) {
                const key = fetchCustomerImages.imageUrl.split('/').pop() || ''

                await deleteImage(key)

                await prisma.customerImage.deleteMany({
                    where: {
                        customerId,
                        type: 'PHOTO',
                    },
                })
            }

            customerImages = await prisma.customerImage.create({
                data: customerImage,
            })
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
                        phone1: {
                            startsWith: searchString,
                            mode: 'insensitive',
                        },
                    },
                    {
                        phone1: {
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
                },
            })
        )?.map((customer) => {
            return {
                customerId: customer.customerId,
                name: customer.name,
                phone1: customer.phone1,
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
                        phone1: {
                            startsWith: searchString,
                            mode: 'insensitive',
                        },
                    },
                    {
                        phone1: {
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
                        phone2: {
                            startsWith: searchString,
                            mode: 'insensitive',
                        },
                    },
                    {
                        phone2: {
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
            name,
            email,
            phone1,
            address,
            isMarried,
            dob,
            city,
            phone2,
            pincode,
            state,
        }: TCustomer = req.body

        const fetchCustomer = await prisma.customer.findFirst({
            where: {
                customerId,
            },
            include: {
                customerImage: true,
            },
        })

        if (!fetchCustomer) throw new AppError(CUSTOMER_E_0001)
        else {
            const updatedCustomer = await prisma.customer.update({
                where: {
                    customerId,
                },
                data: {
                    address,
                    city,
                    name,
                    phone1,
                    phone2,
                    pincode,
                    state,
                    email,
                    dob,
                    isMarried,
                },
                include: {
                    customerImage: true,
                },
            })

            return responseHandler(res, CUSTOMER_S_0004, updatedCustomer)
        }
    }
)

export const deleteCustomer = catchAsync(
    async (req: Request, res: Response) => {
        await validator(validation.customerIdValidator, req.params)

        const { customerId } = req.params

        const customerData = await prisma.customer.findFirst({
            where: {
                customerId,
            },
        })

        if (!customerData) throw new AppError(CUSTOMER_E_0001)

        await prisma.customer.delete({
            where: {
                customerId,
            },
        })

        return responseHandler(res, CUSTOMER_S_0009)
    }
)

export const getCustomerImages = catchAsync(
    async (req: Request, res: Response) => {
        await validator(validation.customerIdValidator, req.params)

        const { customerId } = req.params

        const customerImages = await prisma.customerImage.findMany({
            where: {
                customerId,
            },
        })

        return responseHandler(res, CUSTOMER_S_0010, customerImages)
    }
)
