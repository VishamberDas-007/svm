import { RESPONSE_TYPE, TResponseCode } from '../../types/global.types'

export const BOOKING_E_0001: TResponseCode = {
    type: RESPONSE_TYPE.ERROR,
    code: 'BOOKING_E_0001',
    isNotify: true,
    message: 'Failed to fetch Booking',
    statusCode: 404,
}

export const BOOKING_E_0002: TResponseCode = {
    type: RESPONSE_TYPE.ERROR,
    code: 'BOOKING_E_0002',
    isNotify: true,
    message: 'Failed to fetch Project Details',
    statusCode: 404,
}

export const BOOKING_E_0003: TResponseCode = {
    type: RESPONSE_TYPE.ERROR,
    code: 'BOOKING_E_0003',
    isNotify: true,
    message: 'Area Unavailability: It exceeds the total project area',
    statusCode: 400,
}

export const BOOKING_E_0004: TResponseCode = {
    type: RESPONSE_TYPE.ERROR,
    code: 'BOOKING_E_0004',
    isNotify: true,
    message: 'Failed to update the penalty data',
    statusCode: 400,
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

export const BOOKING_S_0005: TResponseCode = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'BOOKING_S_0005',
    isNotify: true,
    message: 'Booking deleted successfully',
    statusCode: 200,
}

export const BOOKING_S_0006: TResponseCode = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'BOOKING_S_0006',
    isNotify: true,
    message: 'Penalty added successfully',
    statusCode: 200,
}

export const BOOKING_S_0007: TResponseCode = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'BOOKING_S_0007',
    isNotify: true,
    message: 'Penalty updated successfully',
    statusCode: 200,
}

export const BOOKING_S_0008: TResponseCode = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'BOOKING_S_0008',
    isNotify: true,
    message: 'Penalty list fetched successfully',
    statusCode: 200,
}
