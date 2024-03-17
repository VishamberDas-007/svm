import prisma from '../db'

export const fetchCustomerDetails = async (customerId: string) => {
    const customerDetails = await prisma.customer.findFirst({
        where: {
            customerId,
            isDelete: false,
        },
    })
    return customerDetails
}
