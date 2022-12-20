import { IAccountState } from '@core/account'
import {
    ActivityAction,
    ActivityType,
    EMPTY_HEX_ID,
    getNonRemainderBasicOutputsFromTransaction,
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
        const foundryOutputs = outputs.filter((output) => output.output.type === OUTPUT_TYPE_FOUNDRY)
        for (const foundryOutput of foundryOutputs) {
            activities.push(
                generateFoundryActivity(account, {
                    action: ActivityAction.Mint,
                    processedTransaction,
                    wrappedOutput: foundryOutput,
                })
            )
        }
    }

    const containsNftActivity = outputs.some((output) => output.output.type === OUTPUT_TYPE_NFT)
    if (containsNftActivity) {
        const nftOutputs = outputs.filter((output) => output.output.type === OUTPUT_TYPE_NFT)
        for (const nftOutput of nftOutputs) {
            const output = nftOutput.output as INftOutput
            activities.push(
                generateNftActivity(account, {
                    action: output.nftId === EMPTY_HEX_ID ? ActivityAction.Mint : ActivityAction.Send,
                    processedTransaction,
                    wrappedOutput: nftOutput,
                })
            )
        }
    }

    const containsAliasActivity =
        outputs.some((output) => output.output.type === OUTPUT_TYPE_ALIAS) && !containsFoundryActivity
    if (containsAliasActivity) {
        const aliasOutputs = outputs.filter((output) => output.output.type === OUTPUT_TYPE_ALIAS)
        for (const aliasOutput of aliasOutputs) {
            const output = aliasOutput.output as IAliasOutput
            activities.push(
                generateAliasActivity(account, {
                    action: output.aliasId === EMPTY_HEX_ID ? ActivityAction.Mint : ActivityAction.Send,
                    processedTransaction,
                    wrappedOutput: aliasOutput,
                })
            )
        }
    }

    if (!containsFoundryActivity && !containsNftActivity && !containsAliasActivity) {
        const basicOutputs = getNonRemainderBasicOutputsFromTransaction(
            processedTransaction.outputs,
            account.depositAddress,
            processedTransaction.direction
        )
        for (const basicOutput of basicOutputs) {
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
