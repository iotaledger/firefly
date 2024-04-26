import { IWalletState } from '@core/wallet/interfaces'
import { addOrUpdateNftInAllWalletNfts, buildNftFromNftOutput } from '@core/nfts'
import {
    ActivityAction,
    ActivityDirection,
    getNativeTokenFromOutput,
    getNftId,
    getBasicOrAccountOutputsFromTransaction,
    IProcessedTransaction,
    IWrappedOutput,
    getInvolvedAddresses,
    isImplicitAccountOutput,
} from '@core/wallet'
import { Activity } from '@core/wallet/types'
import { generateSingleBasicActivity } from './generateSingleBasicActivity'
import { generateSingleConsolidationActivity } from './generateSingleConsolidationActivity'
import { generateSingleNftActivity } from './generateSingleNftActivity'
import { AccountOutput, CommonOutput, NftOutput, OutputType } from '@iota/sdk/out/types'

export async function generateActivitiesFromBasicOutputs(
    processedTransaction: IProcessedTransaction,
    wallet: IWalletState
): Promise<Activity[]> {
    const activities = []

    const involvedAddresses = await getInvolvedAddresses(wallet)

    const basicOrAccountInputs = getBasicOrAccountOutputsFromTransaction(
        processedTransaction.wrappedInputs,
        involvedAddresses,
        processedTransaction.direction
    )

    const basicOrAccountOutputs = getBasicOrAccountOutputsFromTransaction(
        processedTransaction.outputs,
        involvedAddresses,
        processedTransaction.direction
    )
    const burnedNftInputs = getBurnedNftInputs(processedTransaction)

    for (const basicOrAccountOutput of basicOrAccountOutputs) {
        let activity: Activity
        const isRemainder = basicOrAccountOutput.remainder

        const basicOrAccountInput = basicOrAccountInputs.find((input) => {
            if (
                input?.output?.type === OutputType.Account &&
                basicOrAccountOutput?.output?.type === OutputType.Account
            ) {
                return (
                    (input.output as AccountOutput).accountId ===
                    (basicOrAccountOutput.output as AccountOutput).accountId
                )
            }
        })

        const burnedNftInputIndex = burnedNftInputs.findIndex(
            (input) =>
                Number(input.output.amount) + (Number(basicOrAccountInput?.output.amount) ?? 0) ===
                Number(basicOrAccountOutput.output.amount)
        )
        const burnedNativeToken = burnedNftInputIndex < 0 ? getBurnedNativeTokens(processedTransaction) : undefined

        if (!isRemainder) {
            if (burnedNftInputIndex >= 0) {
                const wrappedInput = burnedNftInputs[burnedNftInputIndex]
                const nftInput = wrappedInput.output as NftOutput
                activity = await generateSingleNftActivity(
                    wallet,
                    {
                        action: ActivityAction.Burn,
                        processedTransaction,
                        wrappedOutput: basicOrAccountOutput,
                    },
                    getNftId(nftInput.nftId, wrappedInput.outputId)
                )
                const nft = buildNftFromNftOutput(wrappedInput, wallet.depositAddress, false)
                addOrUpdateNftInAllWalletNfts(wallet.id, nft)

                burnedNftInputs.splice(burnedNftInputIndex, 1)
            } else if (burnedNativeToken) {
                activity = await generateSingleBasicActivity(
                    wallet,
                    {
                        action: ActivityAction.Burn,
                        processedTransaction,
                        wrappedOutput: basicOrAccountOutput,
                    },
                    burnedNativeToken.assetId,
                    burnedNativeToken.amount
                )
            } else if (isConsolidation(basicOrAccountOutput, processedTransaction)) {
                activity = await generateSingleConsolidationActivity(wallet, {
                    action: ActivityAction.Send,
                    processedTransaction,
                    wrappedOutput: basicOrAccountOutput,
                })
            } else {
                activity = await generateSingleBasicActivity(wallet, {
                    action: ActivityAction.Send,
                    processedTransaction,
                    wrappedOutput: basicOrAccountOutput,
                })
            }
            activities.push(activity)
        }
    }
    return activities
}

function getBurnedNftInputs(processedTransaction: IProcessedTransaction): IWrappedOutput[] {
    return processedTransaction.wrappedInputs.filter((wrappedInput) => {
        const input = wrappedInput.output
        if (input.type === OutputType.Nft) {
            const nftInput = input as NftOutput
            const nftId = getNftId(nftInput.nftId, wrappedInput.outputId)

            const isIncludedInOutputs = processedTransaction.outputs.some((output) => {
                if (output.output.type === OutputType.Nft) {
                    const nftOutput = output.output as NftOutput
                    return getNftId(nftOutput.nftId, output.outputId) === nftId
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
    processedTransaction: IProcessedTransaction
): { assetId: string; amount: number } | undefined {
    // If the transaction is unblanced and there is a surplus of native tokens on the
    // input side of the transaction: the transaction destroys tokens.
    if (processedTransaction.direction !== ActivityDirection.SelfTransaction) {
        return
    }

    const inputNativeTokens: { [key: string]: number } = getAllNativeTokensFromOutputs(
        processedTransaction.wrappedInputs
    )
    // No burned native tokens if input doesn't contain any native tokens
    if (Object.keys(inputNativeTokens).length === 0) {
        return
    }

    const outputNativeTokens: { [key: string]: number } = getAllNativeTokensFromOutputs(processedTransaction.outputs)
    // Find missing native tokens in outputNativeTokens (ex. input native tokens count === 3, output native tokens count === 2)
    // TO DO: adjust UI to account for burining entire amounts of multiple native tokens in one transaction.
    // We assume here that transaction burns entire amount of only one token.
    // There may be transactions created outside of FF that burn entire amount for multiple tokens from the input side
    // (ex.input native tokens count === 3, output native tokens count === 0)
    let burnedTokenKeys: string[] = Object.keys(inputNativeTokens).filter((key) => !(key in outputNativeTokens))
    if (Object.keys(burnedTokenKeys).length > 0) {
        return { assetId: burnedTokenKeys[0], amount: inputNativeTokens[burnedTokenKeys[0]] }
    }
    // Check if the amount of output native token was larger on the input side (partially burned native tokens)
    burnedTokenKeys = Object.keys(outputNativeTokens).filter((key) => outputNativeTokens[key] < inputNativeTokens[key])
    if (Object.keys(burnedTokenKeys).length > 0) {
        const burnedAmount = inputNativeTokens[burnedTokenKeys[0]] - Number(outputNativeTokens[burnedTokenKeys[0]])
        return { assetId: burnedTokenKeys[0], amount: burnedAmount }
    }
}

function getAllNativeTokensFromOutputs(outputs: IWrappedOutput[]): { [key: string]: number } {
    const nativeTokens: { [key: string]: number } = {}
    for (const output of outputs) {
        if (output.output.type === OutputType.Foundry || output.output.type === OutputType.Basic) {
            const commonOutput = output.output as CommonOutput
            const nativeToken = getNativeTokenFromOutput(commonOutput)
            if (nativeToken) {
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
    const consolidatedInputs = processedTransaction.wrappedInputs.filter((input) => {
        const isBasic = input.output.type === OutputType.Basic
        const isAccount = input.output.type === OutputType.Account
        const isImplicitAccountFeature = isImplicitAccountOutput(input.output)
        return (isBasic || isAccount) && !isImplicitAccountFeature
    })
    const inputsOfSameType = consolidatedInputs.filter((op) => op.output.type === output.output.type)
    const isSelfTransaction = processedTransaction.direction === ActivityDirection.SelfTransaction
    const isSameAmount =
        inputsOfSameType.reduce((sum, input) => sum + Number(input.output.amount), 0) === Number(output.output.amount)

    const allBasicNonImplicitAccountOrAccountsInputs =
        consolidatedInputs.length === processedTransaction.wrappedInputs.length

    return allBasicNonImplicitAccountOrAccountsInputs && isSelfTransaction && isSameAmount
}
