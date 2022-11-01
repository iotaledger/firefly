import type { Unit } from '@iota/unit-converter'

/**
 * The parameters of a send operation.
 */
export type SendOperationParameters = {
    address: string
    amount: string
    unit: Unit
    message: string
    tag?: string
    metadata?: string
}
