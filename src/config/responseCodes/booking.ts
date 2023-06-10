import { RESPONSE_TYPE, TResponseCode } from '../../types/global.types'

export const BOOKING_E_0001: TResponseCode = {
    type: RESPONSE_TYPE.ERROR,
    code: 'BOOKING_E_0001',
    isNotify: true,
    message: 'Booking not found',
    statusCode: 404,
}

export const BOOKING_S_0001: TResponseCode = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'BOOKING_S_0001',
    isNotify: true,
    message: 'Booking created successfully',
    statusCode: 200,
}

export const BOOKING_S_0002: TResponseCode = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'BOOKING_S_0002',
    isNotify: true,
    message: 'Fetched all bookings successfully',
    statusCode: 200,
}

export const BOOKING_S_0003: TResponseCode = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'BOOKING_S_0003',
    isNotify: true,
    message: 'Booking fetched successfully',
    statusCode: 200,
}

export const BOOKING_S_0004: TResponseCode = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'BOOKING_S_0004',
    isNotify: true,
    message: 'Booking updated successfully',
    statusCode: 200,
}
