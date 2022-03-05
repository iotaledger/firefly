import type { Unit } from '@iota/unit-converter'

/**
 * The parameters of a send operation.
 */
export type SendOperationParameters = {
    address: string
    amount: number
    unit: Unit
    message: string
}
