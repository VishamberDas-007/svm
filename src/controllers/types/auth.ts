export type TLogin = {
    email: string
    password: string
}

export type TRegister = {
    name: string
    email: string
    password: string
    phone: string
    address?: string
}

export type TValidateEmailOtp = {
    email: string
    otp: number
}

export type TSetNewPassword = {
    email: string
    password: string
    emailOtpToken: string
}
