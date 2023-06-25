import { Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import { TCreateProject, TUpdateProject } from './types/project'
import prisma from '../db'
import responseHandler from '../utils/responseHandler'
import {
    PROJECT_E_0001,
    PROJECT_E_0002,
    PROJECT_S_0001,
    PROJECT_S_0002,
    PROJECT_S_0003,
} from '../config/responseCodes/project'
import { Project } from '@prisma/client'
import AppError from '../utils/AppError'
import validator from '../validations'
import * as validation from '../validations/project.validator'
import * as generalValidation from '../validations/_general.validator'
import { projectExists } from '../services/project.service'
import { TListData } from '../types/global.types'

export const newProject = catchAsync(async (req: Request, res: Response) => {
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
    }: TCreateProject = req.body

    if (parentId) {
        const project = await projectExists(parentId)

        if (!project) throw new AppError(PROJECT_E_0002)
    }

    const newProject = await prisma.project.create({
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
        },
    })

    return responseHandler(res, PROJECT_S_0001, newProject)
})

export const getAllProjects = catchAsync(
    async (req: Request, res: Response) => {
        const { page = 1, pageSize = 20 } = req.query

        const filterString = req.query.filterString as string

        const skip = (+page - 1) * +pageSize

        let projectList: Project[] = [],
            projectCount = 0

        if (!filterString) {
            await prisma.$transaction(async (prisma) => {
                projectList = await prisma.project.findMany({
                    take: +pageSize,
                    skip: skip,
                })
                projectCount = await prisma.project.count()
            })
        } else {
            projectList = await prisma.project.findMany({
                take: +pageSize,
                skip: skip,
                where: {
                    OR: [
                        {
                            name: {
                                startsWith: filterString,
                                mode: 'insensitive',
                            },
                        },
                        {
                            name: {
                                contains: filterString,
                                mode: 'insensitive',
                            },
                        },

                        {
                            address1: {
                                startsWith: filterString,
                                mode: 'insensitive',
                            },
                        },
                        {
                            address1: {
                                contains: filterString,
                                mode: 'insensitive',
                            },
                        },

                        {
                            address2: {
                                startsWith: filterString,
                                mode: 'insensitive',
                            },
                        },
                        {
                            address2: {
                                contains: filterString,
                                mode: 'insensitive',
                            },
                        },
                    ],
                },
                orderBy: {
                    createdAt: 'desc',
                },
            })
            projectCount = await prisma.project.count()
        }

        const result: TListData<Project> = {
            list: projectList,
            meta: {
                totalCount: projectCount,
                page: +page,
                pageSize: +pageSize,
            },
        }

        return responseHandler(res, PROJECT_S_0002, result)
    }
)

export const updateProject = catchAsync(async (req: Request, res: Response) => {
    await validator(generalValidation.projectIdValidator, req.params)

    await validator(validation.updateProjectValidator, req.body)

    const projectId = req.params.projectId

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
    }: TUpdateProject = req.body

    const updateProject = await prisma.project.update({
        where: {
            projectId,
        },
        data: {
            address1,
            address2,
            area,
            description,
            name,
            ownerName,
            pincode,
            status,
            unit,
        },
    })

    return responseHandler(res, PROJECT_S_0001, updateProject)
})

export const getProject = catchAsync(async (req: Request, res: Response) => {
    await validator(generalValidation.projectIdValidator, req.params)

    const projectId = req.params.projectId

    const fetchProject = await prisma.project.findFirst({
        where: {
            projectId,
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
