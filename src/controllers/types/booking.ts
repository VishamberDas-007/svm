import { PaymentStatus, PaymentType } from '@prisma/client'
import { TQueryRequest } from '../../types/global.types'

export type TBooking = {
    projectId: string
    plotNo: string
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
    referralId: string
}

export type TBookingUpdate = TBooking & {
    paymentId: string
}

export type TBookingList = TQueryRequest & {
    query: {
        searchString: string
        projectIds: string
        paymentStatus: string
        paymentType: string
    }
}

export type TRedisData = {
    bookingId: string
    name: string
    email: string
    phone: string
    amount: number
}
