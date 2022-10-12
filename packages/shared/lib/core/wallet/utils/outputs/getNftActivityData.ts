import { IProcessedTransaction, INftActivityData } from '../../interfaces'
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

export function getNftActivityData(
    processedTransaction: IProcessedTransaction,
    account: IAccountState
): INftActivityData {
    const { outputs, isIncoming, claimingData, transactionId } = processedTransaction
    const { output, outputId } = getNftOutputFromTransaction(outputs)

    const { storageDeposit, giftedStorageDeposit } = getStorageDepositFromOutput(output) // probably we need to sum up all storage deposits
    const immutableMetadata = getImmutableMetadataFromNft(output)

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
        immutableMetadata,
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

function getImmutableMetadataFromNft(output: OutputTypes) {
    if (output.type === OUTPUT_TYPE_NFT) {
        const metadata = output.immutableFeatures?.find((feature) => feature.type === 2) as IMetadataFeature
        if (!metadata) {
            return undefined
        }
        const parsedMetadata = JSON.parse(Converter.hexToUtf8(metadata.data))
        return parsedMetadata as Record<string, unknown>
    }
    return undefined
}
