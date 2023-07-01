import { Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import { TCreateExpense } from './types/expense'
import prisma from '../db'
import responseHandler from '../utils/responseHandler'
import { EXPENSE_S_0001, EXPENSE_S_0002 } from '../config/responseCodes/expense'
import validator from '../validations'
import * as validation from '../validations/expense.validator'
import * as generalValidation from '../validations/_general.validator'

export const addExpense = catchAsync(async (req: Request, res: Response) => {
    await validator(validation.createExpenseValidator, req.body)
    const {
        landPurchase,
        nonAgricultural,
        planningAndLayout,
        landDevelopment,
        brokerage,
        landVisitCharge,
        projectId,
    }: TCreateExpense = req.body

    const createExpense = await prisma.expense.create({
        data: {
            landPurchase,
            nonAgricultural,
            planningAndLayout,
            landDevelopment,
            brokerage,
            landVisitCharge,
            projectId,
        },
    })

    return responseHandler(res, EXPENSE_S_0001, createExpense)
})

export const getProjectExpense = catchAsync(
    async (req: Request, res: Response) => {
        await validator(generalValidation.projectIdValidator, req.params)

        const { projectId } = req.params

        const fetchProjectExpense = await prisma.project.findFirst({
            where: {
                projectId,
            },
            include: {
                expense: true,
                miscExpense: true,
            },
        })

        return responseHandler(res, EXPENSE_S_0002, fetchProjectExpense)
    }
)

// export const updateProjectExpense=catchAsync(
//     async (req: Request, res: Response) => {
//                 const { projectId } = req.params

//                 const fetchProjectExpense = await prisma.project.findFirst({
//                     where: {
//                         projectId,
//                     },
//                     include: {
//                         expense: true,
//                         miscExpense: true,
//                     },
//                 })

//                 return responseHandler(res, EXPENSE_S_0002, fetchProjectExpense)
//     })
