import { IAccountState } from '@core/account'
import { IProcessedTransaction } from '../../interfaces'
import {
    getAmountFromOutput,
    getNativeTokenFromOutput,
    getStorageDepositFromOutput,
    getMainTransactionOutputFromTransaction,
    isOutputAsync,
} from '../../utils'

export function containsFunds(processedTransaction: IProcessedTransaction, account: IAccountState): boolean {
    const { output } = getMainTransactionOutputFromTransaction(
        processedTransaction.outputs,
        account.depositAddress,
        processedTransaction.isIncoming
    )
    const isAsync = isOutputAsync(output)

    const nativeToken = getNativeTokenFromOutput(output)

    const { storageDeposit } = getStorageDepositFromOutput(output)
    const rawAmount = getAmountFromOutput(output) - storageDeposit
    return isAsync && (rawAmount > 0 || (nativeToken && Number(nativeToken.amount) > 0))
}
