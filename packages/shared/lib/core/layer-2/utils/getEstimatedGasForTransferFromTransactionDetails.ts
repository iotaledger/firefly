import { NewTransactionDetails, NewTransactionType, getAddressFromSubject } from '@core/wallet'
import { getIscpTransferMethod } from './getIscpTransferMethod'
import { GAS_BUDGET } from '../constants'

export function getEstimatedGasForTransferFromTransactionDetails(
    transactionDetails: NewTransactionDetails
): Promise<number> {
    const address = getAddressFromSubject(transactionDetails.recipient)
    const rawAmount = transactionDetails.type === NewTransactionType.TokenTransfer ? transactionDetails.rawAmount : '0'
    const asset = transactionDetails.type === NewTransactionType.TokenTransfer ? transactionDetails.asset : undefined

    if (asset) {
        return (
            getIscpTransferMethod(address, asset, rawAmount)?.estimateGas() ?? Promise.resolve(GAS_BUDGET.toJSNumber())
        )
    } else {
        return Promise.resolve(GAS_BUDGET.toJSNumber())
    }
}
