import { Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import { TCreateProject } from './types/project'
import prisma from '../db'
import responseHandler from '../utils/responseHandler'
import { PROJECT_S_0001 } from '../config/responseCodes/project'

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
    }: TCreateProject = req.body

    const newProject = await prisma.project.create({
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

    return responseHandler(res, PROJECT_S_0001, newProject)
})
