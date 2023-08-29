import { IPaymentType, Installment } from '@prisma/client'

export type TIBankDetails = {
    paymentType: IPaymentType
    accountNumber?: string
    bankName?: string
    chequeNumber?: string
    upiId?: string
    penalty?: number
    installmentNo: number
}

export type TCreateInstallment = {
    bookingId: string
    amount: number
    data: TIBankDetails[]
}
