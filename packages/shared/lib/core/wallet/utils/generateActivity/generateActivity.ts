import { IAccountState } from '@core/account'
import {
    ActivityAction,
    ActivityType,
    EMPTY_HEX_ID,
    getActivityType,
    getAliasOutputFromTransaction,
    getFoundryOutputFromTransaction,
    getMainOutputFromTransaction,
    getNftOutputFromTransaction,
    IProcessedTransaction,
} from '@core/wallet'
import { Activity } from '@core/wallet/types'
import type { IAliasOutput, INftOutput } from '@iota/types'
import { generateAliasActivity } from './generateAliasActivity'
import { generateFoundryActivity } from './generateFoundryActivity'
import { generateNftActivity } from './generateNftActivity'
import { generateTransactionActivity } from './generateTransactionActivity'
import { getActivityTypeFromOutput } from './helper'

export function generateActivities(processedTransaction: IProcessedTransaction, account: IAccountState): Activity[] {
    if (processedTransaction.wrappedInputs?.length > 0) {
        return generateActivitiesFromProcessedTransactionsWithInputs(processedTransaction, account)
    } else {
        return generateActivitiesFromProcessedTransactionsWithoutInputs(processedTransaction, account)
    }
}

function generateActivitiesFromProcessedTransactionsWithInputs(
    processedTransaction: IProcessedTransaction,
    account: IAccountState
): Activity[] {
    const type = getActivityType(processedTransaction.outputs)
    switch (type) {
        case ActivityType.Basic:
            return [
                generateTransactionActivity(account, {
                    type,
                    action: ActivityAction.Send,
                    processedTransaction,
                    wrappedOutput: getMainOutputFromTransaction(
                        processedTransaction.outputs,
                        account.depositAddress,
                        processedTransaction.direction
                    ),
                }),
            ]
        case ActivityType.Foundry:
            return [
                generateFoundryActivity(account, {
                    type,
                    action: ActivityAction.Send,
                    processedTransaction,
                    wrappedOutput: getFoundryOutputFromTransaction(processedTransaction.outputs),
                }),
            ]
        case ActivityType.Alias: {
            const wrappedOutput = getAliasOutputFromTransaction(processedTransaction.outputs)
            const output = wrappedOutput.output as IAliasOutput
            return [
                generateAliasActivity(account, {
                    type,
                    action: output.aliasId === EMPTY_HEX_ID ? ActivityAction.Mint : ActivityAction.Send,
                    processedTransaction,
                    wrappedOutput: wrappedOutput,
                }),
            ]
        }
        case ActivityType.Nft: {
            const wrappedOutput = getNftOutputFromTransaction(processedTransaction.outputs)
            const output = wrappedOutput.output as INftOutput
            return [
                generateNftActivity(account, {
                    type,
                    action: output.nftId === EMPTY_HEX_ID ? ActivityAction.Mint : ActivityAction.Send,
                    processedTransaction,
                    wrappedOutput,
                }),
            ]
        }
    }
}

/*
 * If we cannot get the detailed inputs for a transaction, we would need to blind guess what the user did with the transaction.
 * Therefore we set the action to `Unknown`
 */
function generateActivitiesFromProcessedTransactionsWithoutInputs(
    processedTransaction: IProcessedTransaction,
    account: IAccountState
): Activity[] {
    const nonRemainderOutputs = processedTransaction.outputs.filter((wrappedOutput) => !wrappedOutput.remainder)
    return nonRemainderOutputs.map((wrappedOutput) => {
        const params = {
            type: getActivityTypeFromOutput(wrappedOutput),
            action: ActivityAction.Unknown,
            processedTransaction,
            wrappedOutput,
        }
        switch (params.type) {
            case ActivityType.Basic:
                return generateTransactionActivity(account, params)
            case ActivityType.Foundry:
                return generateFoundryActivity(account, params)
            case ActivityType.Alias:
                return generateAliasActivity(account, params)
            case ActivityType.Nft:
                return generateNftActivity(account, params)
        }
    })
}
