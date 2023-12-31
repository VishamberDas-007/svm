// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PrismaClient } = require('@prisma/client')

const array = [
    'PROJECT_READ',
    'PROJECT_WRITE',
    'AD_ACCOUNT_READ',
    'AD_ACCOUNT_WRITE',
    'BOOKING_READ',
    'BOOKING_WRITE',
    'CUSTOMER_READ',
    'CUSTOMER_WRITE',
    'EXPENSE_READ',
    'EXPENSE_WRITE',
    'REFERRAL_READ',
    'REFERRAL_WRITE',
    'ROLE_READ',
    'ROLE_WRITE',
    'USER_READ',
    'USER_WRITE',
    'INSTALLMENT_READ',
    'INSTALLMENT_WRITE',
    'WEBSITE_WRITE',
    'WEBSITE_READ',
]

const seedMasterPermissions = async () => {
    const Prisma = new PrismaClient()

    const data = array.map((d) => {
        return {
            label: d.replaceAll('_', ' '),
            value: d,
            group: d.split('_')[0],
        }
    })
    console.log('🚀 ~ file: script.js:37 ~ data ~ data:', data)

    await Prisma.permission.createMany({
        data,
    })

    console.log('DONE')
}

// seedMasterPermissions()
