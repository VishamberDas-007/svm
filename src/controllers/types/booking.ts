import { PaymentStatus, PaymentType } from '@prisma/client'

export type TBooking = {
    projectId: string
    address1: string
    address2: string
    pincode: string
    area: number
    totalAmt: number
    paidAmt: number
    remainAmt: number
    installmentAmt: number
    paymentType: PaymentType
    paymentStatus: PaymentStatus
    customerId: string
    adminAccountId: number
    installmentCount: number
    accountNo: string
    bankName: string
    chequeNo: string
    upiId: string
}

export type TBookingUpdate = TBooking & {
    paymentId: string
}
