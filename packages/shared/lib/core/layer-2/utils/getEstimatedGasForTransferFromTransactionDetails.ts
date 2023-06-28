import { GAS_BUDGET } from '../constants'

export function getEstimatedGasForTransferFromTransactionDetails(): Promise<number> {
    // TODO: Add impl gas estimate with wasp API
    return Promise.resolve(GAS_BUDGET.toJSNumber())
}
