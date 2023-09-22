import { OutputParams, Assets } from '@iota/sdk/out/types'
import { convertBech32AddressToEd25519Address, convertDateToUnixTimestamp, Converter, IAddressUnlockCondition, IBasicOutput, IExpirationUnlockCondition, IMetadataFeature, INftOutput, ISenderFeature, ITagFeature, ITimelockUnlockCondition, serializeOutput } from '@core/utils'
import { NewTransactionType } from '../stores'
import { getEstimatedGasForTransferFromTransactionDetails, getLayer2MetadataForTransfer } from '@core/layer-2/utils'
import { NewTransactionDetails } from '@core/wallet/types'
import { getAddressFromSubject } from '@core/wallet/utils'
import { ReturnStrategy } from '../enums'
import { getCoinType } from '@core/profile'
import { get } from 'svelte/store'
import { getSelectedAccount, selectedAccount } from '@core/account'

export async function getOutputParameters(transactionDetails: NewTransactionDetails): Promise<OutputParams> {
    const { layer2Parameters } = transactionDetails ?? {}
    const isLayer2Transaction = !!layer2Parameters

    return isLayer2Transaction
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
    const { expirationDate, timelockDate, giftStorageDeposit, layer2Parameters } = transactionDetails ?? {}

    // Prepare a dummy output for gas estimation (using serialization and models copied from iota.js)
    // This should be replaced with serialization from iots-sdk once it becomes available
    const senderAddress = getSelectedAccount().depositAddress
    const recipientAddress = layer2Parameters?.networkAddress
    let amount = getAmountFromTransactionDetails(transactionDetails)
    const assets = getAssetFromTransactionDetails(transactionDetails)
    const tag = transactionDetails?.tag ? Converter.utf8ToHex(transactionDetails?.tag) : undefined
    let metadata = getLayer2MetadataForTransfer(transactionDetails)
    const expirationUnixTime = expirationDate ? convertDateToUnixTimestamp(expirationDate) : undefined
    const timelockUnixTime = timelockDate ? convertDateToUnixTimestamp(timelockDate) : undefined

    let output: IBasicOutput | INftOutput

    const unlockConditions = []
    const addressUC: IAddressUnlockCondition = {
        type: 0,
        address: { type: 0, pubKeyHash: convertBech32AddressToEd25519Address(recipientAddress) }
    }
    unlockConditions.push(addressUC)
    if (expirationUnixTime) {
        const expUC: IExpirationUnlockCondition = {
            type: 3,
            returnAddress: { type: 0, pubKeyHash: convertBech32AddressToEd25519Address(senderAddress) },
            unixTime: expirationUnixTime
        }
        unlockConditions.push(expUC)
    }
    if (timelockUnixTime) {
        const timelockUC: ITimelockUnlockCondition = { type: 2, unixTime: timelockUnixTime }
        unlockConditions.push(timelockUC)
    }

    const features = []
    if (tag) {
        const tagFeature: ITagFeature = { type: 3, tag }
        features.push(tagFeature)
    }
    if (metadata) {
        const metadataFeature: IMetadataFeature = { type: 2, data: metadata }
        features.push(metadataFeature)
    }
    const senderFeature: ISenderFeature = {
        type: 0,
        address: { type: 0, pubKeyHash: convertBech32AddressToEd25519Address(layer2Parameters.senderAddress) }
    }
    features.push(senderFeature)

    if (transactionDetails.type === NewTransactionType.TokenTransfer) {
        output = {
            type: 3,
            amount,
            nativeTokens: assets?.nativeTokens ? [ ...assets.nativeTokens ] : undefined,
            unlockConditions,
            features
        } as IBasicOutput
    } else if (transactionDetails.type === NewTransactionType.NftTransfer) {
        output = {
            type: 6,
            amount,
            nftId: assets?.nftId,
            unlockConditions,
            features
        } as INftOutput
    } else {
        throw new Error('Unsupported NewTransactionType')
    }

    const serializedOutput = serializeOutput(output)

    const estimatedGas = await getEstimatedGasForTransferFromTransactionDetails(serializedOutput)

    // Now that we have the gasEstimation, update the values for the actual output
    if (estimatedGas) {
        amount = amount + estimatedGas
        metadata = getLayer2MetadataForTransfer(transactionDetails, estimatedGas)
    }

    return <OutputParams>{
        recipientAddress,
        amount,
        ...(assets && { assets }),
        features: {
            ...(tag && { tag }),
            ...(metadata && { metadata }),
            ...(layer2Parameters && { sender: layer2Parameters.senderAddress }),
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
