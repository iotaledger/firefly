import { IAccountState } from '@core/account'
import { addOrUpdateNftInAllAccountNfts, buildNftFromNftOutput } from '@core/nfts'
import {
    ActivityAction,
    OUTPUT_TYPE_NFT,
    ActivityDirection,
    getNftId,
    getNonRemainderBasicOutputsFromTransaction,
    IProcessedTransaction,
    IWrappedOutput,
    OUTPUT_TYPE_BASIC,
} from '@core/wallet'
import { Activity } from '@core/wallet/types'
import { INftOutput } from '@iota/types'
import { generateSingleBasicActivity } from './generateSingleBasicActivity'
import { generateSingleNftActivity } from './generateSingleNftActivity'

export function generateActivitiesFromBasicOutputs(
    processedTransaction: IProcessedTransaction,
    account: IAccountState
): Activity[] {
    const activities = []

    const basicOutputs = getNonRemainderBasicOutputsFromTransaction(
        processedTransaction.outputs,
        account.depositAddress,
        processedTransaction.direction
    )
    const burnedNftInputs = getBurnedNftInputs(processedTransaction)
    for (const basicOutput of basicOutputs) {
        const burnedNftInputIndex = burnedNftInputs.findIndex(
            (input) => input.output.amount === basicOutput.output.amount
        )

        let activity: Activity
        if (burnedNftInputIndex >= 0) {
            const wrappedInput = burnedNftInputs[burnedNftInputIndex]
            const nftInput = wrappedInput.output as INftOutput
            activity = generateSingleNftActivity(
                account,
                {
                    action: ActivityAction.Burn,
                    processedTransaction,
                    wrappedOutput: basicOutput,
                },
                getNftId(nftInput.nftId, wrappedInput.outputId)
            )
            const nft = buildNftFromNftOutput(nftInput, wrappedInput.outputId, false)
            addOrUpdateNftInAllAccountNfts(account.index, nft)

            burnedNftInputs.splice(burnedNftInputIndex, 1)
        } else {
            const action = isConsolidation(basicOutput, processedTransaction)
                ? ActivityAction.Consolidation
                : ActivityAction.Send
            activity = generateSingleBasicActivity(account, {
                action,
                processedTransaction,
                wrappedOutput: basicOutput,
            })
        }
        activities.push(activity)
    }
    return activities
}

function getBurnedNftInputs(processedTransaction: IProcessedTransaction): IWrappedOutput[] {
    return processedTransaction.wrappedInputs.filter((wrappedInput) => {
        const input = wrappedInput.output
        if (input.type === OUTPUT_TYPE_NFT) {
            const nftId = getNftId(input.nftId, wrappedInput.outputId)

            const isIncludedInOutputs = processedTransaction.outputs.some((output) => {
                if (output.output.type === OUTPUT_TYPE_NFT) {
                    return getNftId(output.output.nftId, output.outputId) === nftId
                } else {
                    return false
                }
            })

            return !isIncludedInOutputs
        } else {
            return false
        }
    })
}

function isConsolidation(output: IWrappedOutput, processedTransaction: IProcessedTransaction): boolean {
    const allBasicInputs = processedTransaction.wrappedInputs.every((input) => input.output.type === OUTPUT_TYPE_BASIC)
    const isSelfTransaction = processedTransaction.direction === ActivityDirection.SelfTransaction
    const isSameAmount =
        processedTransaction.wrappedInputs.reduce((sum, input) => sum + Number(input.output.amount), 0) ===
        Number(output.output.amount)

    return allBasicInputs && isSelfTransaction && isSameAmount
}
