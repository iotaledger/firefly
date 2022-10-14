import { IProcessedTransaction, INftActivityData, INftMetadata } from '../../interfaces'
import {
    getStorageDepositFromOutput,
    getNftOutputFromTransaction,
    getRecipientFromOutput,
    isSubjectInternal,
    getSubjectFromAddress,
    getBech32AddressFromAddressTypes,
} from '..'
import { ActivityDirection, ActivityType } from '@core/wallet/enums'
import { OUTPUT_TYPE_NFT } from '@core/wallet/constants'
import { IAccountState } from '@core/account'
import type { IMetadataFeature, ISenderFeature, OutputTypes } from '@iota/types'
import { Converter } from '@lib/converter'
import { getAsyncDataFromOutput } from './getAsyncDataFromOutput'
import { MimeType } from '@core/wallet/types'

export function getNftActivityData(
    processedTransaction: IProcessedTransaction,
    account: IAccountState
): INftActivityData {
    const { outputs, isIncoming, claimingData, transactionId } = processedTransaction
    const { output, outputId } = getNftOutputFromTransaction(outputs)

    const { storageDeposit, giftedStorageDeposit } = getStorageDepositFromOutput(output) // probably we need to sum up all storage deposits
    const metadata = getMetadataFromNft(output)

    const recipient = getRecipientFromOutput(output)
    const sender = getSenderFromNft(output)

    const subject = isIncoming ? sender : recipient
    const isInternal = isSubjectInternal(subject)

    const direction = isIncoming ? ActivityDirection.Incoming : ActivityDirection.Outgoing

    const asyncData = getAsyncDataFromOutput(output, transactionId, claimingData, account)

    return {
        type: ActivityType.Nft,
        direction,
        outputId,
        isInternal,
        storageDeposit,
        giftedStorageDeposit,
        metadata,
        sender,
        recipient,
        subject,
        ...asyncData,
    }
}

function getSenderFromNft(output: OutputTypes) {
    if (output.type === OUTPUT_TYPE_NFT) {
        const sender = output.immutableFeatures?.find((feature) => feature.type === 0) as ISenderFeature
        if (!sender) {
            return undefined
        }
        const address = getBech32AddressFromAddressTypes(sender.address)
        return getSubjectFromAddress(address)
    }
    return undefined
}

function getMetadataFromNft(output: OutputTypes): INftMetadata {
    if (output.type === OUTPUT_TYPE_NFT) {
        const metadata = output.immutableFeatures?.find((feature) => feature.type === 2) as IMetadataFeature
        if (!metadata) {
            return undefined
        }
        const parsedData = JSON.parse(Converter.hexToUtf8(metadata.data))

        // TODO: Add some validation that everything is correct
        const parsedMetadata: INftMetadata = {
            id: parsedData.id,
            standard: parsedData.standard,
            version: parsedData.version,
            type: parsedData.type as MimeType,
            uri: parsedData.uri,
            name: parsedData.name,
            collectionId: parsedData.collectionId,
            collectionName: parsedData.collectionName,
            royalties: parsedData.royalties,
            issuerName: parsedData.issuerName,
            description: parsedData.description,
            attributes: parsedData.attributes?.map((attribute) => ({
                trait_type: attribute.trait_type,
                value: attribute.value,
            })),
        }

        return parsedMetadata
    }
    return undefined
}
