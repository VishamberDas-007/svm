export type TCreateUser = {
    name: string
    email: string
    phone: string
    address: string
    roleId: number
}

export type TUpdateUser = {
    name?: string
    email?: string
    phone?: string
    address?: string
    roleId?: number
}
