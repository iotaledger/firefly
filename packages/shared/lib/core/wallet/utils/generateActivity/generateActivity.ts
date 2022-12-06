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
    IWrappedOutput,
} from '@core/wallet'
import { OUTPUT_TYPE_ALIAS, OUTPUT_TYPE_BASIC, OUTPUT_TYPE_FOUNDRY, OUTPUT_TYPE_NFT } from '@core/wallet/constants'
import { Activity } from '@core/wallet/types'
import type { IAliasOutput, INftOutput } from '@iota/types'
import { generateAliasActivity } from './generateAliasActivity'
import { generateFoundryActivity } from './generateFoundryActivity'
import { generateNftActivity } from './generateNftActivity'
import { generateTransactionActivity } from './generateTransactionActivity'

export function generateActivities(processedTransaction: IProcessedTransaction, account: IAccountState): Activity[] {
    if (processedTransaction.wrappedInputs.length > 1) {
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

export interface IActivityGenerationParameters {
    type: ActivityType
    action: ActivityAction
    processedTransaction: IProcessedTransaction
    wrappedOutput: IWrappedOutput
}

function generateActivitiesFromProcessedTransactionsWithoutInputs(
    processedTransaction: IProcessedTransaction,
    account: IAccountState
): Activity[] {
    return processedTransaction.outputs.map((wrappedOutput) => {
        const type = getActivityTypeFromOutput(wrappedOutput)
        return generateActivityForAccount(account, {
            type,
            action: ActivityAction.Unknown,
            processedTransaction,
            wrappedOutput,
        })
    })
}

function generateActivityForAccount(account: IAccountState, params: IActivityGenerationParameters): Activity {
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
}

function getActivityTypeFromOutput(output: IWrappedOutput): ActivityType {
    switch (output.output.type) {
        case OUTPUT_TYPE_NFT:
            return ActivityType.Nft
        case OUTPUT_TYPE_ALIAS:
            return ActivityType.Alias
        case OUTPUT_TYPE_FOUNDRY:
            return ActivityType.Foundry
        case OUTPUT_TYPE_BASIC:
            return ActivityType.Basic
    }
}
