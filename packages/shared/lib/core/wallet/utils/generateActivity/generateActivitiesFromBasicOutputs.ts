import { IAccountState } from '@core/account'
import { addOrUpdateNftInAllAccountNfts, buildNftFromNftOutput } from '@core/nfts'
import {
    ActivityAction,
    ActivityDirection,
    getNftId,
    getNonRemainderBasicOutputsFromTransaction,
    IProcessedTransaction,
    IWrappedOutput,
    OUTPUT_TYPE_BASIC,
    OUTPUT_TYPE_NFT,
} from '@core/wallet'
import { Activity } from '@core/wallet/types'
import { INftOutput } from '@iota/types'
import { generateSingleBasicActivity } from './generateSingleBasicActivity'
import { generateSingleConsolidationActivity } from './generateSingleConsolidationActivity'
import { generateSingleNftActivity } from './generateSingleNftActivity'

export async function generateActivitiesFromBasicOutputs(
    processedTransaction: IProcessedTransaction,
    account: IAccountState
): Promise<Activity[]> {
    const activities = []

    const basicOutputs = getNonRemainderBasicOutputsFromTransaction(
        processedTransaction.outputs,
        account.depositAddress,
        processedTransaction.direction
    )
    const burnedNftInputs = getBurnedNftInputs(processedTransaction)
    for (const basicOutput of basicOutputs) {
        let activity: Activity

        const isSelfTransaction = processedTransaction.direction === ActivityDirection.SelfTransaction
        const burnedNftInputIndex = burnedNftInputs.findIndex(
            (input) => input.output.amount === basicOutput.output.amount
        )
        const burnedNativeToken =
            burnedNftInputIndex < 0 ? getBurnedNativeTokens(basicOutput, processedTransaction) : undefined

        if (isSelfTransaction && burnedNftInputIndex >= 0) {
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
            const nft = buildNftFromNftOutput(wrappedInput, account.depositAddress, false)
            addOrUpdateNftInAllAccountNfts(account.index, nft)

            burnedNftInputs.splice(burnedNftInputIndex, 1)
        } else if (isSelfTransaction && burnedNativeToken) {
            activity = await generateSingleBasicActivity(
                account,
                {
                    action: ActivityAction.Burn,
                    processedTransaction,
                    wrappedOutput: basicOutput,
                },
                burnedNativeToken.assetId,
                burnedNativeToken.amount
            )
        } else if (isSelfTransaction && isConsolidation(basicOutput, processedTransaction)) {
            activity = generateSingleConsolidationActivity(account, {
                action: ActivityAction.Send,
                processedTransaction,
                wrappedOutput: basicOutput,
            })
        } else {
            activity = await generateSingleBasicActivity(account, {
                action: ActivityAction.Send,
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

function getBurnedNativeTokens(
    output: IWrappedOutput,
    processedTransaction: IProcessedTransaction
): { assetId: string; amount: number } {
    if (processedTransaction.direction !== ActivityDirection.SelfTransaction) {
        return null
    }

    const inputNativeTokens: { [key: string]: number } = getAllNativeTokensFromOutputs(
        processedTransaction.wrappedInputs
    )
    const outputNativeTokens: { [key: string]: number } = getAllNativeTokensFromOutputs([output])
    for (const inputNativeTokenId of Object.keys(inputNativeTokens)) {
        if (!outputNativeTokens[inputNativeTokenId]) {
            return { assetId: inputNativeTokenId, amount: inputNativeTokens[inputNativeTokenId] }
        }

        if (inputNativeTokens[inputNativeTokenId] > Number(outputNativeTokens[inputNativeTokenId])) {
            const burnedAmount = inputNativeTokens[inputNativeTokenId] - Number(outputNativeTokens[inputNativeTokenId])
            return { assetId: inputNativeTokenId, amount: burnedAmount }
        }
    }
}

function getAllNativeTokensFromOutputs(outputs: IWrappedOutput[]): { [key: string]: number } {
    const nativeTokens: { [key: string]: number } = {}
    for (const output of outputs) {
        for (const nativeToken of output.output.nativeTokens ?? []) {
            if (!nativeTokens[nativeToken.id]) {
                nativeTokens[nativeToken.id] = 0
            }
            nativeTokens[nativeToken.id] += Number(nativeToken.amount)
        }
    }
    return nativeTokens
}

function isConsolidation(output: IWrappedOutput, processedTransaction: IProcessedTransaction): boolean {
    const allBasicInputs = processedTransaction.wrappedInputs.every((input) => input.output.type === OUTPUT_TYPE_BASIC)
    const isSelfTransaction = processedTransaction.direction === ActivityDirection.SelfTransaction
    const isSameAmount =
        processedTransaction.wrappedInputs.reduce((sum, input) => sum + Number(input.output.amount), 0) ===
        Number(output.output.amount)

    return allBasicInputs && isSelfTransaction && isSameAmount
}
