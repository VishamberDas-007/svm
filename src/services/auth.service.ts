import {
    AUTH_E_0004,
    AUTH_E_0005,
    AUTH_E_0006,
} from '../config/responseCodes/auth'
import prisma from '../db'
import AppError from '../utils/AppError'

export const emailOtpRequest = async (email: string) => {
    const emailExists = await prisma.otp.findFirst({
        where: {
            email: email,
        },
    })

    if (emailExists) {
        await prisma.otp.delete({
            where: {
                otpId: emailExists.otpId,
            },
        })
    }
}

export const emailOtpValidate = async (email: string, otp: number) => {
    const emailExists = await prisma.otp.findFirst({
        where: {
            email: email,
        },
    })

    if (!emailExists) {
        throw new AppError(AUTH_E_0004)
    }

    if (emailExists && new Date() > new Date(emailExists.expiryTime)) {
        throw new AppError(
            AUTH_E_0005,
            undefined,
            {
                isOtpExpired: true,
            },
            true
        )
    } else if (emailExists.otp !== otp) {
        throw new AppError(AUTH_E_0006, undefined, undefined, true)
    }

    await prisma.otp.delete({
        where: {
            otpId: emailExists.otpId,
        },
    })
}
