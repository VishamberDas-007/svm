import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const array = [
    'findFirst',
    'findUnique',
    'delete',
    'findMany',
    'count',
    'deleteMany',
]

const createWhereIsDeleteFalse = (params: Prisma.MiddlewareParams) => {
    return {
        ...params.args?.['where'],
        isDelete: false,
    }
}

const createWhereIsDeleteTrue = (params: Prisma.MiddlewareParams) => {
    return {
        ...params.args?.['where'],
        isDelete: true,
    }
}

prisma.$use(async (params, next) => {
    if (
        params.model === 'Role' ||
        params.model === 'Booking' ||
        params.model === 'Project' ||
        params.model === 'AdminAccount' ||
        params.model === 'Installment' ||
        params.model === 'Customer'
    ) {
        if (!params.args?.where && array.includes(params.action)) {
            params.args = {
                where: {},
            }
        }

        if (params.action === 'findFirst' || params.action === 'findUnique')
            params.args.where = createWhereIsDeleteFalse(params)
        else if (params.action === 'findMany') {
            params.args?.where?.isDelete === undefined || false
                ? (params.args.where = createWhereIsDeleteFalse(params))
                : (params.args['where'] = createWhereIsDeleteTrue(params))
        } else if (params.action === 'delete') {
            params.action = 'update'
            params.args['data'] = { isDelete: true }
        } else if (params.action == 'deleteMany') {
            // Delete many queries
            params.action = 'updateMany'
            if (params.args?.data != undefined) {
                params.args.data['isDelete'] = true
            } else {
                params.args['data'] = { isDelete: true }
            }
        } else if (params.action === 'count') {
            params.args?.where?.isDelete === undefined || false
                ? (params.args['where'] = createWhereIsDeleteFalse(params))
                : (params.args['where'] = createWhereIsDeleteTrue(params))
        }
    }

    return next(params)
})

prisma
    .$connect()
    .then(() => {
        console.log('Connected to database')
    })
    .catch((err: any) => {
        console.log(err)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

export default prisma
