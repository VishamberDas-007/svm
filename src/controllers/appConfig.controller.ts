import { Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import { pincodeList } from '../pincode'
import responseHandler from '../utils/responseHandler'
import { APP_CONFIG_S_0001 } from '../config/responseCodes/appConfig'

export const getPincodeList = catchAsync(
    async (req: Request, res: Response) => {
        const pincode = req.query.zip as string

        if (!pincode) {
            return responseHandler(
                res,
                APP_CONFIG_S_0001,
                Object.values(pincodeList).slice(0, 30)
            )
        } else {
            const pincodeCity: {
                Region: string
                Division: string
                Office: string
                OfficeType: string
                District: string
                State: string
                Pincode: number
            }[] = []

            const list = Object.values(pincodeList)
            let counter = 0

            for (let index = 0; index < list.length; index++) {
                const a = list[index].District.toLowerCase().startsWith(pincode)
                const b = list[index].State.toLowerCase().startsWith(pincode)
                const c = list[index].Pincode.toString().startsWith(pincode)
                const d = list[index].Division.toLowerCase().startsWith(pincode)

                if (a || b || c || d) {
                    const value = list[index]
                    ++counter
                    pincodeCity.push(value)
                }
                if (counter >= 30) {
                    break
                }
            }

            return responseHandler(res, APP_CONFIG_S_0001, pincodeCity)
        }
    }
)
