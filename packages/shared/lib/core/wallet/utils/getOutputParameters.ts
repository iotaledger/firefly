import { OutputParams, Assets } from '@iota/sdk/out/types'
import { convertDateToUnixTimestamp, Converter, IBasicOutput, INftOutput, serializeOutput } from '@core/utils'
import { NewTransactionType } from '../stores'
import { getEstimatedGasForTransferFromTransactionDetails, getLayer2MetadataForTransfer } from '@core/layer-2/utils'
import { NewTransactionDetails } from '@core/wallet/types'
import { getAddressFromSubject } from '@core/wallet/utils'
import { ReturnStrategy } from '../enums'
import { getCoinType } from '@core/profile'
import { getSelectedAccount, prepareOutput } from '@core/account'
import { DEFAULT_TRANSACTION_OPTIONS } from '../constants'

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

async function buildOutputParametersForLayer2(transactionDetails: NewTransactionDetails): Promise<OutputParams> {
    const { expirationDate, timelockDate, layer2Parameters } = transactionDetails ?? {}
    const selectedAccount = getSelectedAccount()

    if (!layer2Parameters) {
        // This should never happen as it's checked right before calling this function
        throw new Error('Missing L2 parameters')
    }

    const senderAddress = layer2Parameters.senderAddress
    const recipientAddress = layer2Parameters?.networkAddress
    let amount = getAmountFromTransactionDetails(transactionDetails)
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

    const outputForEstimate = (await prepareOutput(
        selectedAccount.index,
        outputParams,
        DEFAULT_TRANSACTION_OPTIONS
    )) as unknown as IBasicOutput | INftOutput
    const serializedOutput = serializeOutput(outputForEstimate)
    const gasEstimatePayload = await getEstimatedGasForTransferFromTransactionDetails(serializedOutput)

    // Now that we have the gasEstimation, update the values for the actual output
    if (gasEstimatePayload.gasBurned && gasEstimatePayload.gasFeeCharged) {
        amount = (parseInt(outputForEstimate.amount, 10) + gasEstimatePayload.gasFeeCharged).toString()
    }

    return <OutputParams>{
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
