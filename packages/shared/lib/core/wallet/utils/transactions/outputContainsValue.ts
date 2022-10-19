import { IAccountState } from '@core/account'
import { ActivityType } from '@core/wallet/enums'
import { IProcessedTransaction } from '../../interfaces'
import { getNativeTokenFromOutput, getMainTransactionOutputFromTransaction, isOutputAsync, getActivityType } from '..'
import { getAmountFromOutput, getStorageDepositFromOutput } from '../generateActivity/helper'
import { IBasicOutput } from '@iota/types'

export function outputContainsValue(processedTransaction: IProcessedTransaction, account: IAccountState): boolean {
    const { wrappedOutput } = getMainTransactionOutputFromTransaction(
        processedTransaction.outputs,
        account.depositAddress,
        processedTransaction.isIncoming
    )
    const output = wrappedOutput.output as IBasicOutput
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
