import { Request } from 'express'
import { TQueryRequest } from '../../types/global.types'

export type TCustomer = {
    name: string
    email: string
    phone1: string
    phone2?: string
    city?: string
    pincode?: string
    state?: string
    address?: string
}

export type TBasicListWhereClause = {
    OR: (
        | {
              phone1: {
                  startsWith: string
                  mode: 'insensitive'
                  contains?: undefined
              }
          }
        | {
              phone1: {
                  contains: string
                  mode: 'insensitive'
                  startsWith?: undefined
              }
          }
    )[]
}

export type TCustomerRequest = Request & {
    files: {
        aadharImageFront: any
        aadharImageRear: any
        panImages: any
        customerImage: any
    }
    file: any
}

export type TCustomerList = TQueryRequest
