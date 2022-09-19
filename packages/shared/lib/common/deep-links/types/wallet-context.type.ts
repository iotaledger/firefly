import type { Unit } from '@iota/unit-converter'

/**
 * The parameters of a send operation.
 */
export type SendOperationParameters = {
    address: string
    amount: string
    unit: Unit
    message: string
}

/**
 * The parameters of a bridge operation.
 */
export type SwapOutOperationParameters = SendOperationParameters & {
    chainId: string
    receiverAddress: string
}
