import { Request } from 'express'
import { TQueryRequest } from '../../types/global.types'

export type TCustomer = {
    firstName: string
    lastName: string
    aadharNo: string
    email: string
    phone: string
}

export type TBasicListWhereClause = {
    OR: (
        | {
              aadharNo: {
                  startsWith: string
                  mode: 'insensitive'
                  contains?: undefined
              }
          }
        | {
              aadharNo: {
                  contains: string
                  mode: 'insensitive'
                  startsWith?: undefined
              }
          }
    )[]
}

export type TCustomerRequest = Request & {
    files: {
        aadharImages: any
        panImage: any
    }
}

export type TCustomerList = TQueryRequest
