import { User } from '@prisma/client'
import prisma from '../db'

export const userExists = async (userId: string): Promise<User | null> => {
    const userData = await prisma.user.findFirst({
        where: {
            userId,
        },
    })
    return userData
}
