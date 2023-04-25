import { Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import { TCreateProject } from './types/project'
import prisma from '../db'
import responseHandler from '../utils/responseHandler'
import { PROJECT_S_0001, PROJECT_S_0002 } from '../config/responseCodes/project'
import { Project } from '@prisma/client'

export const newProject = catchAsync(async (req: Request, res: Response) => {
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
        parentId,
    }: TCreateProject = req.body

    const newProject = await prisma.project.create({
        data: {
            parentId: parentId,
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
            })
            projectCount = await prisma.project.count()
        }

        const result = {
            projectList,
            meta: {
                totalCount: projectCount,
                page: +page,
                pageSize: +pageSize,
            },
        }

        return responseHandler(res, PROJECT_S_0002, result)
    }
)
