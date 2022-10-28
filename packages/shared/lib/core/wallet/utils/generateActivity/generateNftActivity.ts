import { IProcessedTransaction, INftMetadata } from '../../interfaces'
import { getNftOutputFromTransaction, convertHexAddressToBech32, outputContainsValue, hashOutputId } from '..'
import { ActivityType } from '@core/wallet/enums'
import { ADDRESS_TYPE_NFT, EMPTY_HEX_ID } from '@core/wallet/constants'
import { IAccountState } from '@core/account'
import type { IMetadataFeature, INftOutput } from '@iota/types'
import { getAsyncDataFromOutput } from '../generateActivity/helper/getAsyncDataFromOutput'
import { MimeType, NftActivity } from '@core/wallet/types'
import { getSendingInformation } from './helper'
import { Converter } from '@core/utils'

export function generateNftActivity(processedTransaction: IProcessedTransaction, account: IAccountState): NftActivity {
    const { outputs, claimingData, transactionInputs, time, inclusionState, transactionId } = processedTransaction
    const wrappedOutput = getNftOutputFromTransaction(outputs)
    const outputId = wrappedOutput.outputId
    const output = wrappedOutput.output as INftOutput
    const id = outputId || transactionId

    const isHidden = false
    const isAssetHidden = false
    const containsValue = outputContainsValue(processedTransaction, account)

    const inputs = transactionInputs

    const nftId = getNftId(output, outputId)
    const storageDeposit = Number(output.amount)
    const giftedStorageDeposit = 0
    const metadata = getMetadataFromNft(output)

    const sendingInfo = getSendingInformation(processedTransaction, output, account)
    const asyncData = getAsyncDataFromOutput(output, transactionId, claimingData, account)

    return {
        type: ActivityType.Nft,
        id,
        transactionId,
        outputId,
        nftId,
        time,
        isHidden,
        giftedStorageDeposit,
        isAssetHidden,
        containsValue,
        inputs,
        inclusionState,
        immutableFeatures: output.immutableFeatures,
        storageDeposit,
        metadata,
        asyncData,
        ...sendingInfo,
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
    const nftId = isNewNft ? hashOutputId(outputId) : output.nftId
    return convertHexAddressToBech32(ADDRESS_TYPE_NFT, nftId)
}
