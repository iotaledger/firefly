import { getSelectedAccount, prepareOutput } from '@core/account'
import { ILayer2GasEstimatePayload } from '@core/layer-2/interfaces'
import {
    getEstimatedGasForTransferFromTransactionDetails,
    getLayer2MetadataForTransfer,
    outputHexBytes,
} from '@core/layer-2/utils'
import { getCoinType } from '@core/profile'
import { Converter, convertDateToUnixTimestamp } from '@core/utils'
import { NewTransactionDetails } from '@core/wallet/types'
import { getAddressFromSubject } from '@core/wallet/utils'
import { Assets, BasicOutput, NftOutput, OutputParams } from '@iota/sdk/out/types'
import BigInteger from 'big-integer'
import { ReturnStrategy } from '../enums'
import { NewTransactionType, newTransactionDetails } from '../stores'
import { getDefaultTransactionOptions } from '../utils'

export async function getOutputParameters(transactionDetails: NewTransactionDetails): Promise<OutputParams> {
    const { layer2Parameters } = transactionDetails ?? {}

    return layer2Parameters
        ? buildOutputParametersForLayer2(transactionDetails)
        : buildOutputParameters(transactionDetails)
}

function buildOutputParameters(transactionDetails: NewTransactionDetails): OutputParams {
    const { recipient, expirationDate, timelockDate, giftStorageDeposit } = transactionDetails ?? {}

    const recipientAddress = getAddressFromSubject(recipient)
    const amount = getAmountFromTransactionDetails(transactionDetails)
    const assets = getAssetFromTransactionDetails(transactionDetails)
    const tag = transactionDetails?.tag ? Converter.utf8ToHex(transactionDetails?.tag) : undefined
    const metadata = transactionDetails?.metadata ? Converter.utf8ToHex(transactionDetails?.metadata) : undefined
    const expirationUnixTime = expirationDate ? convertDateToUnixTimestamp(expirationDate) : undefined
    const timelockUnixTime = timelockDate ? convertDateToUnixTimestamp(timelockDate) : undefined

    return <OutputParams>{
        recipientAddress,
        amount,
        ...(assets && { assets }),
        features: {
            ...(tag && { tag }),
            ...(metadata && { metadata }),
        },
        unlocks: {
            ...(expirationUnixTime && { expirationUnixTime }),
            ...(timelockUnixTime && { timelockUnixTime }),
        },
        storageDeposit: {
            returnStrategy: giftStorageDeposit ? ReturnStrategy.Gift : ReturnStrategy.Return,
        },
    }
}

async function buildOutputParametersForLayer2(
    transactionDetails: NewTransactionDetails
): Promise<OutputParams | undefined> {
    const { expirationDate, timelockDate, layer2Parameters } = transactionDetails ?? {}
    const selectedAccount = getSelectedAccount()

    if (!layer2Parameters) {
        // This should never happen as it's checked right before calling this function
        throw new Error('Missing L2 parameters')
    }

    const senderAddress = layer2Parameters.senderAddress
    const recipientAddress = layer2Parameters?.networkAddress
    const amount = getAmountFromTransactionDetails(transactionDetails)
    const assets = getAssetFromTransactionDetails(transactionDetails)
    const tag = transactionDetails?.tag ? Converter.utf8ToHex(transactionDetails?.tag) : undefined
    const metadata = getLayer2MetadataForTransfer(transactionDetails)
    const expirationUnixTime = expirationDate ? convertDateToUnixTimestamp(expirationDate) : undefined
    const timelockUnixTime = timelockDate ? convertDateToUnixTimestamp(timelockDate) : undefined

    const outputParams = <OutputParams>{
        recipientAddress,
        amount,
        ...(assets && { assets }),
        features: {
            ...(tag && { tag }),
            ...(metadata && { metadata }),
            ...(layer2Parameters && { sender: senderAddress }),
        },
        unlocks: {
            ...(expirationUnixTime && { expirationUnixTime }),
            ...(timelockUnixTime && { timelockUnixTime }),
        },
        storageDeposit: {
            returnStrategy: ReturnStrategy.Gift,
        },
    }

    async function getEstimateData(): Promise<{
        outputForEstimate: BasicOutput | NftOutput
        gasEstimatePayload: ILayer2GasEstimatePayload
    }> {
        const outputForEstimate = (await prepareOutput(
            selectedAccount.index,
            outputParams,
            getDefaultTransactionOptions()
        )) as unknown as BasicOutput | NftOutput
        const serializedOutput = await outputHexBytes(outputForEstimate)
        const gasEstimatePayload = await getEstimatedGasForTransferFromTransactionDetails(serializedOutput)
        return {
            outputForEstimate,
            gasEstimatePayload,
        }
    }

    let estimatedData = await getEstimateData()

    if (estimatedData?.gasEstimatePayload?.gasBurned) {
        //  The "+1" is due to an optimization in WASP nodes.
        const metadata = getLayer2MetadataForTransfer(
            transactionDetails,
            (estimatedData.gasEstimatePayload.gasBurned as number) + 1
        )
        if (!outputParams.features) {
            outputParams.features = {}
        }
        outputParams.features.metadata = metadata

        estimatedData = await getEstimateData()

        if (estimatedData?.gasEstimatePayload?.gasFeeCharged) {
            // Now that we have the gasFeeCharged, update the amount & the tx details
            newTransactionDetails.update((state) => {
                if (state?.layer2Parameters) {
                    state.layer2Parameters.gasBudget = BigInteger(
                        estimatedData.gasEstimatePayload.gasFeeCharged as number
                    )
                }
                return state
            })
            outputParams.amount = (
                parseInt(estimatedData.outputForEstimate.amount, 10) + estimatedData.gasEstimatePayload.gasFeeCharged
            ).toString()

            return outputParams
        }
    }
}

function getAmountFromTransactionDetails(transactionDetails: NewTransactionDetails): string {
    let rawAmount: string
    if (transactionDetails.type === NewTransactionType.TokenTransfer) {
        const asset = transactionDetails.asset

        const nativeTokenId = asset?.id === getCoinType() ? undefined : asset?.id

        if (nativeTokenId) {
            rawAmount = transactionDetails?.surplus ?? '0'
        } else {
            rawAmount = BigInt(transactionDetails.rawAmount).toString()
        }
    } else if (transactionDetails.type === NewTransactionType.NftTransfer) {
        rawAmount = transactionDetails?.surplus ?? '0'
    } else {
        rawAmount = '0'
    }
    return rawAmount
}

function getAssetFromTransactionDetails(transactionDetails: NewTransactionDetails): Assets | undefined {
    let assets: Assets | undefined

    if (transactionDetails.type === NewTransactionType.NftTransfer) {
        assets = { nftId: transactionDetails.nftId }
    } else if (transactionDetails.type === NewTransactionType.TokenTransfer) {
        const assetId = transactionDetails.asset?.id

        const nativeTokenId = assetId === getCoinType() ? undefined : assetId

        if (nativeTokenId) {
            const bigAmount = BigInt(transactionDetails.rawAmount)
            assets = {
                nativeTokens: [
                    {
                        id: nativeTokenId,
                        amount: bigAmount,
                    },
                ],
            }

            // If it's a base coin transaction, we don't need to specify assets
        } else {
            assets = undefined
        }
    } else {
        throw new Error('Invalid transaction type')
    }

    return assets
}
