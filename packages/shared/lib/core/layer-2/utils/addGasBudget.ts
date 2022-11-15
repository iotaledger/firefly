import { GAS_BUDGET } from '@core/layer-2/constants'
import BigInteger from 'big-integer'

export function addGasBudget(rawAmount: string): string {
    const bigAmount = BigInteger(rawAmount).add(GAS_BUDGET)
    return bigAmount.toString()
}
