import { Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import {
    TCreateProject,
    TImageUpload,
    TProjectReq,
    TProjectList,
    TUpdateProject,
} from './types/project'
import prisma from '../db'
import responseHandler from '../utils/responseHandler'
import {
    PROJECT_E_0001,
    PROJECT_E_0002,
    PROJECT_S_0001,
    PROJECT_S_0002,
    PROJECT_S_0003,
    PROJECT_S_0004,
    PROJECT_S_0005,
} from '../config/responseCodes/project'
import { Project } from '@prisma/client'
import AppError from '../utils/AppError'
import validator from '../validations'
import * as validation from '../validations/project.validator'
import * as generalValidation from '../validations/_general.validator'
import { projectExists } from '../services/project.service'
import { TListData } from '../types/global.types'
import { deleteImage } from '../aws/s3'

export const newProject = catchAsync(
    async (req: TProjectReq, res: Response) => {
        await validator(validation.createProjectValidator, req.body)

        const {
            parentId,
            address1,
            address2,
            area,
            description,
            name,
            ownerName,
            pincode,
            status,
            unit,
            downPayment,
            emiAmt,
            location,
            totalAmt,
        }: TCreateProject = req.body

        let newProject: Project | null | undefined

        if (parentId) {
            const project = await projectExists(parentId)

            if (!project) throw new AppError(PROJECT_E_0002)
        }

        await prisma.$transaction(async (prisma) => {
            const logoUrl = req.files?.['logo']?.[0].location

            let data: any[] = []

            newProject = await prisma.project.create({
                data: {
                    parentId,
                    address1,
                    address2,
                    area: +area,
                    description,
                    name,
                    ownerName,
                    pincode,
                    status,
                    unit,
                    logoUrl,
                    downPayment,
                    emiAmt,
                    location,
                    totalAmt,
                },
            })

            const planningImageUrls = req.files?.['planningImages']?.map(
                (image: TImageUpload) => ({
                    url: image.location,
                    type: 'PLANNING',
                    projectId: newProject?.projectId,
                })
            )

            const siteImageUrls = req.files?.['siteImages']?.map(
                (image: TImageUpload) => ({
                    url: image.location,
                    type: 'SITE',
                    projectId: newProject?.projectId,
                })
            )

            if (planningImageUrls?.length) {
                data = [...planningImageUrls]
            }

            if (siteImageUrls?.length) {
                data = [...data, ...siteImageUrls]
            }

            await prisma.projectImages.createMany({
                data,
            })
        })
        return responseHandler(res, PROJECT_S_0001, newProject)
    }
)

export const getAllProjects = catchAsync(
    async (req: TProjectList, res: Response) => {
        const { page = 1, pageSize = 20, area, status } = req.query

        const searchString = req.query.searchString as string

        const skip = (+page - 1) * +pageSize

        let projectList: Project[] = [],
            projectCount = 0,
            totalQueryCount = 0,
            whereClause = {}

        if (area && !isNaN(+area)) {
            whereClause = {
                area: {
                    gte: +area,
                    lt: +area,
                },
            }
        }

        if (status) {
            whereClause = {
                ...whereClause,
                status,
            }
        }

        if (searchString) {
            whereClause = {
                ...whereClause,
                OR: [
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
                        ownerName: {
                            startsWith: searchString,
                            mode: 'insensitive',
                        },
                    },
                    {
                        ownerName: {
                            contains: searchString,
                            mode: 'insensitive',
                        },
                    },
                ],
            }
        }

        projectList = await prisma.project.findMany({
            take: +pageSize,
            skip: skip,
            where: whereClause,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                projectImages: true,
            },
        })

        projectCount = await prisma.project.count()

        totalQueryCount = await prisma.project.count({ where: whereClause })

        const result: TListData<Project> = {
            list: projectList,
            meta: {
                totalCount: projectCount,
                page: +page,
                pageSize: +pageSize,
                totalQueryCount,
            },
        }

        return responseHandler(res, PROJECT_S_0002, result)
    }
)

export const updateProject = catchAsync(
    async (req: TProjectReq, res: Response) => {
        await validator(generalValidation.projectIdValidator, req.params)

        await validator(validation.updateProjectValidator, req.body)

        const { projectId } = req.params

        const {
            address1,
            area,
            name,
            description,
            ownerName,
            pincode,
            status,
            unit,
            address2,
            downPayment,
            emiAmt,
            location,
            totalAmt,
        }: TUpdateProject = req.body

        let planningImageUrls: string[] = [],
            siteImageUrls: string[] = [],
            imageUpdate:
                | {
                      projectImages: {
                          createMany: {
                              data: any[]
                              skipDuplicates: boolean
                          }
                      }
                  }
                | undefined,
            deleteProjectImageFileNames: string[] = []

        planningImageUrls =
            req.files?.['planningImages']?.map((image: TImageUpload) => ({
                url: image.location,
                type: 'PLANNING',
            })) || []

        siteImageUrls =
            req.files?.['siteImages']?.map((image: TImageUpload) => ({
                url: image.location,
                type: 'SITE',
            })) || []

        const projectImages = await prisma.projectImages.findMany({
            where: {
                projectId,
            },
        })

        deleteProjectImageFileNames = projectImages.length
            ? projectImages.map((project) => {
                  const fileName =
                      project.url.split('/')[project.url.split('/')?.length - 1]

                  return fileName
              })
            : []

        if (siteImageUrls.length || planningImageUrls.length)
            imageUpdate = {
                projectImages: {
                    createMany: {
                        data: [...siteImageUrls, ...planningImageUrls],
                        skipDuplicates: true,
                    },
                },
            }
        // }

        for await (const fileName of deleteProjectImageFileNames) {
            await deleteImage(fileName)
        }

        await prisma.projectImages.deleteMany({
            where: {
                projectId,
            },
        })

        const updateProject = await prisma.project.update({
            where: {
                projectId,
            },
            data: {
                ...imageUpdate,
                address1,
                address2,
                area: +area,
                description,
                name,
                ownerName,
                pincode,
                status,
                unit,
                downPayment,
                emiAmt,
                location,
                totalAmt,
            },
        })

        return responseHandler(res, PROJECT_S_0004, updateProject)
    }
)

export const getProject = catchAsync(async (req: Request, res: Response) => {
    await validator(generalValidation.projectIdValidator, req.params)

    const projectId = req.params.projectId

    const fetchProject = await prisma.project.findFirst({
        where: {
            projectId,
        },
        include: {
            projectImages: true,
        },
    })

    if (!fetchProject) throw new AppError(PROJECT_E_0001)
    else return responseHandler(res, PROJECT_S_0003, fetchProject)
})

export const getProjectBasicList = catchAsync(
    async (req: Request, res: Response) => {
        const fetchProjects = await prisma.project.findMany({
            select: {
                projectId: true,
                name: true,
                description: true,
            },
        })

        return responseHandler(res, PROJECT_S_0002, fetchProjects)
    }
)

export const uploadHappyCustomerImages = catchAsync(
    async (req: TProjectReq, res: Response) => {
        await validator(generalValidation.projectIdValidator, req.params)

        const { projectId } = req.params

        const images =
            req.files?.['customers']?.map((image: TImageUpload) => ({
                url: image.location,
                type: 'HAPPY_CUSTOMER',
                projectId,
            })) || []

        await prisma.projectImages.createMany({
            data: images,
        })

        return responseHandler(res, PROJECT_S_0005)
    }
)
