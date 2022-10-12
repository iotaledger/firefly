import { IAccountState } from '@core/account'
import { ActivityType } from '@core/wallet/enums'
import { IProcessedTransaction } from '../../interfaces'
import {
    getAmountFromOutput,
    getNativeTokenFromOutput,
    getStorageDepositFromOutput,
    getMainTransactionOutputFromTransaction,
    isOutputAsync,
    getActivityType,
} from '..'

export function containsValue(processedTransaction: IProcessedTransaction, account: IAccountState): boolean {
    const { wrappedOutput } = getMainTransactionOutputFromTransaction(
        processedTransaction.outputs,
        account.depositAddress,
        processedTransaction.isIncoming
    )
    const output = wrappedOutput.output
    const type = getActivityType(processedTransaction.outputs)

    const whiteListedActivityTypes = [ActivityType.Alias, ActivityType.Foundry]
    if (whiteListedActivityTypes.includes(type)) {
        return true
    }

    const isAsync = isOutputAsync(output)
    const nativeToken = getNativeTokenFromOutput(output)

    const { storageDeposit } = getStorageDepositFromOutput(output)
    const rawAmount = getAmountFromOutput(output) - storageDeposit
    return !isAsync || rawAmount > 0 || (!!nativeToken && Number(nativeToken.amount) > 0)
}
