// import prisma from "../db"
// import catchAsync from "../utils/catchAsync"
// import responseHandler from "../utils/responseHandler"

// export const newBooking = catchAsync(async (req: Request, res: Response) => {
//     const {
//         address1,
//         area,
//         name,
//         description,
//         ownerName,
//         pincode,
//         status,
//         unit,
//         address2,
//     } = req.body

//     const newProject = await prisma..create({
//         data: {
//             address1,
//             address2,
//             area,
//             description,
//             name,
//             ownerName,
//             pincode,
//             status,
//             unit,
//         },
//     })

//     return responseHandler(res, PROJECT_S_0001, newProject)
// })
