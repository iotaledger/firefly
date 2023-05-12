import { localize, parseCurrency } from '@core/i18n'
import { convertToRawAmount } from './convertToRawAmount'
import { TokenStandard } from '../enums'
import Big from 'big.js'
import { IAsset } from '..'

export function validateTokenAmount(
    amount: string,
    asset: IAsset,
    unit: string,
    allowZeroOrNull = false
): Promise<string> {
    if (amount === undefined || asset?.metadata === undefined) {
        return Promise.reject()
    }
    const amountAsFloat = parseCurrency(amount)
    const isAmountZeroOrNull = !Number(amountAsFloat)
    const requiresRawAmount =
        (asset.metadata.standard === TokenStandard.BaseToken && unit === asset.metadata.subunit) ||
        asset.metadata.decimals === 0
    const bigAmount = convertToRawAmount(amount, asset.metadata, unit)

    // Zero value transactions can still contain metadata/tags
    let error = ''
    if (allowZeroOrNull && isAmountZeroOrNull) {
        return Promise.resolve(Big(0).toString())
    } else if (isAmountZeroOrNull) {
        error = localize('error.send.amountInvalidFormat')
    } else if (requiresRawAmount && Number.parseInt(amount, 10).toString() !== amount) {
        error = localize('error.send.amountNoFloat')
    } else if (bigAmount.gt(Big(asset?.balance?.available ?? 0))) {
        error = localize('error.send.amountTooHigh')
    } else if (bigAmount.lte(Big(0))) {
        error = localize('error.send.amountZero')
    } else if (!bigAmount.mod(1).eq(Big(0))) {
        error = localize('error.send.amountSmallerThanSubunit')
    }

    if (error) {
        return Promise.reject(error)
    }
    return Promise.resolve(bigAmount.toString())
}
