import { RESPONSE_TYPE, TResponseCode } from '../../types/global.types'

export const WEBSITE_S_0001: TResponseCode = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'WEBSITE_S_0001',
    isNotify: true,
    message: 'Your response is recorded successfullly',
    statusCode: 200,
}

export const WEBSITE_S_0002: TResponseCode = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'WEBSITE_S_0002',
    isNotify: true,
    message: 'Fetched all contact-us list successfully',
    statusCode: 200,
}
