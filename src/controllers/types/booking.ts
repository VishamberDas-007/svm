import { PaymentStatus, PaymentType } from '@prisma/client'

export type TCreateBooking = {
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
}

export type TUpdateBooking = {
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
}
