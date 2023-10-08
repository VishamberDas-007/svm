import { RESPONSE_TYPE } from '../../types/global.types'

export const PROJECT_E_0001 = {
    type: RESPONSE_TYPE.ERROR,
    code: 'PROJECT_E_0001',
    isNotify: false,
    message: 'Failed to fetch project details',
    statusCode: 404,
}

export const PROJECT_E_0002 = {
    type: RESPONSE_TYPE.ERROR,
    code: 'PROJECT_E_0002',
    isNotify: false,
    message: 'No such parent project exists',
    statusCode: 404,
}

export const PROJECT_S_0001 = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'PROJECT_S_0001',
    isNotify: false,
    message: 'Project created successfully',
    statusCode: 200,
}

export const PROJECT_S_0002 = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'PROJECT_S_0002',
    isNotify: false,
    message: 'Projects fetched successfully',
    statusCode: 200,
}

export const PROJECT_S_0003 = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'PROJECT_S_0003',
    isNotify: false,
    message: 'Project details fetched',
    statusCode: 200,
}

export const PROJECT_S_0004 = {
    type: RESPONSE_TYPE.SUCCESS,
    code: 'PROJECT_S_0004',
    isNotify: false,
    message: 'Project updated successfully',
    statusCode: 200,
}
