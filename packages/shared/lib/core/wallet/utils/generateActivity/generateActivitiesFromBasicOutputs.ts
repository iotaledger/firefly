import { IAccountState } from '@core/account'
import { addOrUpdateNftInAllAccountNfts, buildNftFromNftOutput } from '@core/nfts'
import {
    ActivityAction,
    ActivityDirection,
    getNftId,
    getNonRemainderBasicOutputsFromTransaction,
    IProcessedTransaction,
    IWrappedOutput,
} from '@core/wallet'
import { Activity } from '@core/wallet/types'
import { generateSingleBasicActivity } from './generateSingleBasicActivity'
import { generateSingleConsolidationActivity } from './generateSingleConsolidationActivity'
import { generateSingleNftActivity } from './generateSingleNftActivity'
import { CommonOutput, NftOutput, OutputType } from '@iota/wallet'

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
            (input) => input.output.getAmount() === basicOutput.output.getAmount()
        )
        const burnedNativeToken =
            burnedNftInputIndex < 0 ? getBurnedNativeTokens(basicOutput, processedTransaction) : undefined

        if (isSelfTransaction && burnedNftInputIndex >= 0) {
            const wrappedInput = burnedNftInputs[burnedNftInputIndex]
            const nftInput = wrappedInput.output as NftOutput
            activity = await generateSingleNftActivity(
                account,
                {
                    action: ActivityAction.Burn,
                    processedTransaction,
                    wrappedOutput: basicOutput,
                },
                getNftId(nftInput.getNftId(), wrappedInput.outputId)
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
            activity = await generateSingleConsolidationActivity(account, {
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
        if (input.getType() === OutputType.Nft) {
            const nftInput = input as NftOutput
            const nftId = getNftId(nftInput.getNftId(), wrappedInput.outputId)

            const isIncludedInOutputs = processedTransaction.outputs.some((output) => {
                if (output.output.getType() === OutputType.Nft) {
                    const nftOutput = output.output as NftOutput
                    return getNftId(nftOutput.getNftId(), output.outputId) === nftId
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
        if (output.output.type !== OutputType.Treasury) {
            const commonOutput = output.output as CommonOutput
            for (const nativeToken of commonOutput.getNativeTokens() ?? []) {
                if (!nativeTokens[nativeToken.id]) {
                    nativeTokens[nativeToken.id] = 0
                }
                nativeTokens[nativeToken.id] += Number(nativeToken.amount)
            }
        }
    }
    return nativeTokens
}

function isConsolidation(output: IWrappedOutput, processedTransaction: IProcessedTransaction): boolean {
    const allBasicInputs = processedTransaction.wrappedInputs.every(
        (input) => input.output.getType() === OutputType.Basic
    )
    const isSelfTransaction = processedTransaction.direction === ActivityDirection.SelfTransaction
    const isSameAmount =
        processedTransaction.wrappedInputs.reduce((sum, input) => sum + Number(input.output.getAmount()), 0) ===
        Number(output.output.getAmount())

    return allBasicInputs && isSelfTransaction && isSameAmount
}
