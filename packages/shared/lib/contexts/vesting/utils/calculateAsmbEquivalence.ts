import { formatNumber } from '@core/i18n'
import { TokenMetadata } from '@core/wallet'
import Big from 'big.js'
import { ASSEMBLY_IOTA_EQUIVALENCE_FACTOR } from '../constants'

export function calculateAsmbEquivalence(rawAmount: number, tokenMetadata: TokenMetadata): string | undefined {
    const unitAmount = convertAmountToMatchUnit(rawAmount, tokenMetadata.decimals)
    let calculateAsmbEquivalence: Big = Big('0')
    if (tokenMetadata.name === 'IOTA') {
        calculateAsmbEquivalence = unitAmount.mul(ASSEMBLY_IOTA_EQUIVALENCE_FACTOR)
    }
    return `~ ${formatNumber(calculateAsmbEquivalence.toNumber(), 0, 0, undefined, true)} ASMB`
}

export function convertAmountToMatchUnit(amount: number, decimalsInUnit: number): Big {
    return Big(amount).div(Big(10).pow(decimalsInUnit))
}
