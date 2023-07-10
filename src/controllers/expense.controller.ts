import { Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import { TCreateExpense, TUpdateExpense } from './types/expense'
import prisma from '../db'
import responseHandler from '../utils/responseHandler'
import {
    EXPENSE_E_0001,
    EXPENSE_S_0001,
    EXPENSE_S_0002,
    EXPENSE_S_0003,
    EXPENSE_S_0004,
} from '../config/responseCodes/expense'
import validator from '../validations'
import * as validation from '../validations/expense.validator'
import * as generalValidation from '../validations/_general.validator'
import AppError from '../utils/AppError'

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
        miscExpense,
    }: TCreateExpense = req.body

    const createExpense = await prisma.project.update({
        where: {
            projectId,
        },
        data: {
            expense: {
                create: {
                    landPurchase,
                    nonAgricultural,
                    planningAndLayout,
                    landDevelopment,
                    brokerage,
                    landVisitCharge,
                },
            },
            miscExpense: {
                createMany: {
                    data: miscExpense,
                },
            },
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
export const getAllProjectExpense = catchAsync(
    async (req: Request, res: Response) => {
        const expenseList = await prisma.expense.findMany()
        return responseHandler(res, EXPENSE_S_0003, expenseList)
    }
)

export const updateProjectExpense = catchAsync(
    async (req: Request, res: Response) => {
        await validator(validation.expenseIdValidator, req.params)
        await validator(validation.updateExpenseValidator, req.body)

        const { expenseId } = req.params
        const {
            brokerage,
            landDevelopment,
            landPurchase,
            landVisitCharge,
            miscExpense,
            nonAgricultural,
            planningAndLayout,
            projectId,
        }: TUpdateExpense = req.body

        const fetchProjectExpense = await prisma.expense.findFirst({
            where: {
                projectId,
                expenseId,
            },
        })

        if (!fetchProjectExpense) {
            throw new AppError(EXPENSE_E_0001)
        } else {
            await prisma.expense.update({
                where: {
                    expenseId,
                },
                data: {
                    brokerage,
                    landDevelopment,
                    landPurchase,
                    landVisitCharge,
                    nonAgricultural,
                    planningAndLayout,
                },
            })

            if (miscExpense?.length) {
                await prisma.miscExpense.deleteMany({
                    where: {
                        projectId,
                    },
                })

                await prisma.miscExpense.createMany({
                    data: miscExpense.map((expense) => ({
                        ...expense,
                        projectId,
                    })),
                })
            }
        }

        return responseHandler(res, EXPENSE_S_0004, {
            ...fetchProjectExpense,
            miscExpense,
            brokerage,
            landDevelopment,
            landPurchase,
            landVisitCharge,
            nonAgricultural,
            planningAndLayout,
        })
    }
)
