import { IPaymentType, Installment } from '@prisma/client'

export type TIBankDetails = {
    paymentType: IPaymentType
    accountNumber: string
    bankName: string
    chequeNumber: string
    upiId: string
    penalty: number
    adminAccountId: number | null
    // installmentNo: number
}

export type TCreateInstallment = {
    bookingId: string
    amount: number
    data: TIBankDetails[]
}

export type TUpdateInstallment = TIBankDetails & {
    bookingId: string
    amount: number
}
