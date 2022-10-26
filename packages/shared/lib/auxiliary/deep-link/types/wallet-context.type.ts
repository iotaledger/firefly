import { IotaUnit } from '@core/utils'

/**
 * The parameters of a send operation.
 */
export type SendOperationParameters = {
    address: string
    amount: string
    unit: IotaUnit
    message: string
}
