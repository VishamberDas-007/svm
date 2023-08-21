import { Installment } from '@prisma/client'

export type TCreateInstallment = Installment & {
    accountNumber: string
    bankName: string
    chequeNumber: string
    upiId: string
}
