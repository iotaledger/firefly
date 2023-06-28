import { NewTokenTransactionDetails, NewTransactionDetails, getAddressFromSubject } from '@core/wallet'
import { getIscpTransferMethod } from './getIscpTransferMethod'
import { GAS_BUDGET } from '../constants'

export function getEstimatedGasForTransferFromTransactionDetails(
    transactionDetails: NewTransactionDetails
): Promise<number> {
    const { recipient, layer2Parameters, rawAmount, asset } = (transactionDetails as NewTokenTransactionDetails) ?? {}

    const address = layer2Parameters
        ? layer2Parameters.networkAddress
        : recipient
        ? getAddressFromSubject(recipient)
        : ''

    if (asset) {
        return (
            getIscpTransferMethod(address, asset, rawAmount)?.estimateGas() ?? Promise.resolve(GAS_BUDGET.toJSNumber())
        )
    } else {
        return Promise.resolve(GAS_BUDGET.toJSNumber())
    }
}
