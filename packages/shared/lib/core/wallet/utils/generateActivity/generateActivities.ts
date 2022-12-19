import { IAccountState } from '@core/account'
import {
    ActivityAction,
    ActivityType,
    EMPTY_HEX_ID,
    getAliasOutputFromTransaction,
    getFoundryOutputFromTransaction,
    getMainOutputFromTransaction,
    getNftOutputFromTransaction,
    IProcessedTransaction,
    OUTPUT_TYPE_ALIAS,
    OUTPUT_TYPE_FOUNDRY,
    OUTPUT_TYPE_NFT,
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
    const outputs = processedTransaction.outputs
    const activities = []
    const containsFoundryActivity = outputs.some((output) => output.output.type === OUTPUT_TYPE_FOUNDRY)
    if (containsFoundryActivity) {
        activities.push(
            generateFoundryActivity(account, {
                action: ActivityAction.Send,
                processedTransaction,
                wrappedOutput: getFoundryOutputFromTransaction(processedTransaction.outputs),
            })
        )
    }
    const containsNftActivity = outputs.some((output) => output.output.type === OUTPUT_TYPE_NFT)
    if (containsNftActivity) {
        const wrappedOutput = getNftOutputFromTransaction(processedTransaction.outputs)
        const output = wrappedOutput.output as INftOutput
        activities.push(
            generateNftActivity(account, {
                action: output.nftId === EMPTY_HEX_ID ? ActivityAction.Mint : ActivityAction.Send,
                processedTransaction,
                wrappedOutput,
            })
        )
    }
    const containsAliasActivity =
        outputs.some((output) => output.output.type === OUTPUT_TYPE_ALIAS) && !containsFoundryActivity
    if (containsAliasActivity) {
        const wrappedOutput = getAliasOutputFromTransaction(processedTransaction.outputs)
        const output = wrappedOutput.output as IAliasOutput
        activities.push(
            generateAliasActivity(account, {
                action: output.aliasId === EMPTY_HEX_ID ? ActivityAction.Mint : ActivityAction.Send,
                processedTransaction,
                wrappedOutput: wrappedOutput,
            })
        )
    }

    if (!containsFoundryActivity && !containsNftActivity && !containsAliasActivity) {
        const basicOutput = getMainOutputFromTransaction(
            processedTransaction.outputs,
            account.depositAddress,
            processedTransaction.direction
        )
        const containsBasicOutput = basicOutput
        if (containsBasicOutput) {
            activities.push(
                generateTransactionActivity(account, {
                    action: ActivityAction.Send,
                    processedTransaction,
                    wrappedOutput: basicOutput,
                })
            )
        }
    }

    return activities
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
