import prisma from '../db'

export const getInstallmentCount = async (
    bookingId: string
): Promise<number> => {
    const count = await prisma.installment.aggregate({
        where: {
            bookingId,
        },
        _max: {
            installmentNo: true,
        },
    })

    return count._max.installmentNo ? ++count._max.installmentNo : 1
}
