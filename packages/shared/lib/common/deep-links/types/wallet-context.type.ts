import { Unit } from '@lib/units'

/**
 * The parameters of a send operation.
 */
export type SendOperationParameters = {
    address: string
    amount: string
    unit: Unit
    message: string
}
