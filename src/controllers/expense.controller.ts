import { Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import {
    TCreateExpense,
    TMonthlyExpenseCreate,
    TUpdateExpense,
} from './types/expense'
import prisma from '../db'
import responseHandler from '../utils/responseHandler'
import {
    EXPENSE_E_0001,
    EXPENSE_E_0002,
    EXPENSE_S_0001,
    EXPENSE_S_0002,
    EXPENSE_S_0003,
    EXPENSE_S_0004,
} from '../config/responseCodes/expense'
import validator from '../validations'
import * as validation from '../validations/expense.validator'
import * as generalValidation from '../validations/_general.validator'
import AppError from '../utils/AppError'
import { TListData } from '../types/global.types'
import { Expense } from '@prisma/client'

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

    const expenseExists = await prisma.expense.findFirst({
        where: {
            projectId,
        },
    })

    if (expenseExists) throw new AppError(EXPENSE_E_0002)

    let data = {}

    if (miscExpense) {
        data = {
            miscExpense: {
                createMany: {
                    data: miscExpense,
                },
            },
        }
    }

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
            ...data,
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

        return responseHandler(res, EXPENSE_S_0002, {
            projectName: fetchProjectExpense?.name || null,
            expense: fetchProjectExpense?.expense || null,
            miscExpense: fetchProjectExpense?.miscExpense || [],
        })
    }
)
export const getAllProjectExpense = catchAsync(
    async (req: Request, res: Response) => {
        const { page = 1, pageSize = 20 } = req.query

        const skip = (+page - 1) * +pageSize

        let expenseCount = 0

        const expenseList = (
            await prisma.expense.findMany({
                take: +pageSize,
                skip,
                include: {
                    project: true,
                },
            })
        )?.map((obj) => ({
            ...obj,
            projectName: obj.project.name,
            project: undefined,
        }))

        expenseCount = await prisma.expense.count()

        // totalQueryCount = await prisma.project.count()

        const result: TListData<Expense> = {
            list: expenseList,
            meta: {
                page: +page,
                pageSize: +pageSize,
                totalCount: expenseCount,
                // totalQueryCount: 0,
            },
        }

        return responseHandler(res, EXPENSE_S_0003, result)
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
                    // project: {
                    //     update: {
                    //         miscExpense: {
                    //             createMany: {
                    //                 data: miscExpense || [],
                    //                 skipDuplicates: true,
                    //             },
                    //         },
                    //     },
                    // },
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

export const createMonthlyExpense = catchAsync(
    async (req: Request, res: Response) => {
        await validator(validation.createMonthlyExpense, req.body)
        const { data }: { data: TMonthlyExpenseCreate[] } = req.body

        await prisma.monthlyExpense.createMany({
            data: data.map((obj) => ({
                cost: obj.cost,
                expenseName: obj.expenseName,
                createdAt: new Date(obj.createdAt),
            })),
            skipDuplicates: true,
        })

        return responseHandler(res, EXPENSE_S_0001)
    }
)

export const updateMonthlyExpense = catchAsync(
    async (req: Request, res: Response) => {
        await validator(validation.updateMonthlyExpense, req.body)
        await validator(validation.expenseIdValidator, req.params)

        const { cost, createdAt, expenseName }: TMonthlyExpenseCreate = req.body
        const { expenseId } = req.params

        const expenseExists = await prisma.monthlyExpense.findFirst({
            where: {
                expenseId,
            },
        })

        if (!expenseExists) throw new AppError(EXPENSE_E_0001)

        const updatedExpense = await prisma.monthlyExpense.update({
            where: {
                expenseId,
            },
            data: {
                cost,
                createdAt: new Date(createdAt),
                expenseName,
            },
        })

        return responseHandler(res, EXPENSE_S_0001, updatedExpense)
    }
)

export const getParticularMonthExpense = catchAsync(
    async (req: Request, res: Response) => {
        await validator(validation.monthYearValidator, req.params)
        const { monthYear } = req.params
        const monthYearArray = monthYear.split('-')

        const lowerBound = new Date(
            +monthYearArray[1],
            +monthYearArray[0] - 1,
            1
        ).toISOString()

        const upperBound = new Date(
            +monthYearArray[0] === 12
                ? +monthYearArray[1] + 1
                : +monthYearArray[1],
            +monthYearArray[0] === 12 ? 0 : +monthYearArray[0],
            1
        ).toISOString()

        const expenseData = await prisma.monthlyExpense.findMany({
            where: {
                createdAt: {
                    gte: lowerBound,
                    lt: upperBound,
                },
            },
        })

        return responseHandler(res, EXPENSE_S_0002, expenseData)
    }
)

export const getAllMonthlyExpense = catchAsync(
    async (req: Request, res: Response) => {
        const expenseList = await prisma.monthlyExpense.findMany()

        const result = expenseList.reduce((prev: any, curr) => {
            const monthYear =
                curr.createdAt.getMonth() + '-' + curr.createdAt.getFullYear()

            if (!prev[monthYear])
                return {
                    ...prev,
                    [monthYear]: curr.cost,
                }
            else {
                prev[monthYear] += curr.cost
                return prev
            }
        }, {})

        return responseHandler(res, EXPENSE_S_0003, result)
    }
)
