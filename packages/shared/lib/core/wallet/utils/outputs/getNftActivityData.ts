import { IProcessedTransaction, INftActivityData, INftMetadata } from '../../interfaces'
import {
    getNftOutputFromTransaction,
    getRecipientFromOutput,
    isSubjectInternal,
    getSenderFromTransaction,
    convertHexAddressToBech32,
    getSubjectFromAddress,
    getSenderAddressFromInputs,
} from '..'
import { ActivityDirection, ActivityType } from '@core/wallet/enums'
import { ADDRESS_TYPE_NFT, EMPTY_HEX_ID, OUTPUT_TYPE_NFT } from '@core/wallet/constants'
import { IAccountState } from '@core/account'
import type { IMetadataFeature, INftOutput } from '@iota/types'
import { Converter } from '@core/utils'
import { getAsyncDataFromOutput } from './getAsyncDataFromOutput'
import { MimeType } from '@core/wallet/types'
import { Blake2b } from '@iota/crypto.js'

export function getNftActivityData(
    processedTransaction: IProcessedTransaction,
    account: IAccountState
): INftActivityData {
    const { outputs, isIncoming, claimingData, detailedTransactionInputs, transactionId } = processedTransaction
    const wrappedOutput = getNftOutputFromTransaction(outputs)
    const outputId = wrappedOutput.outputId
    const output = wrappedOutput.output as INftOutput

    const nftId = getNftId(output, outputId)
    const storageDeposit = Number(output.amount)
    const metadata = getMetadataFromNft(output)

    const recipient = getRecipientFromOutput(output)
    const sender = detailedTransactionInputs
        ? getSubjectFromAddress(getSenderAddressFromInputs(detailedTransactionInputs))
        : getSenderFromTransaction(isIncoming, account.depositAddress, output)

    const subject = isIncoming ? sender : recipient
    const isInternal = isSubjectInternal(subject)

    const direction = isIncoming ? ActivityDirection.Incoming : ActivityDirection.Outgoing

    const asyncData = getAsyncDataFromOutput(output, transactionId, claimingData, account)

    return {
        type: ActivityType.Nft,
        direction,
        outputId,
        nftId,
        immutableFeatures: output.type === OUTPUT_TYPE_NFT ? output.immutableFeatures : [],
        isInternal,
        storageDeposit,
        metadata,
        sender,
        recipient,
        subject,
        ...asyncData,
    }
}

function getMetadataFromNft(output: INftOutput): INftMetadata {
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

function getNftId(output: INftOutput, outputId: string): string {
    const isNewNft = output.nftId === EMPTY_HEX_ID
    const nftId = isNewNft
        ? '0x' + Converter.bytesToHex(Blake2b.sum256(Converter.hexToBytes(outputId.substring(2))))
        : output.nftId
    return convertHexAddressToBech32(ADDRESS_TYPE_NFT, nftId)
}
