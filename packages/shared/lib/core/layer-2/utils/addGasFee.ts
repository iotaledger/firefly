import { GAS_FEE } from '@core/layer-2/constants'
import BigInteger from 'big-integer'

export function addGasFee(rawAmount: string): string {
    const bigAmount = BigInteger(rawAmount).add(GAS_FEE)
    return bigAmount.toString()
}
