import { IProcessedTransaction, INftActivityData } from '../../interfaces'
import {
    getNftOutputFromTransaction,
    getRecipientFromOutput,
    isSubjectInternal,
    getSenderFromTransaction,
    getSubjectFromAddress,
    getSenderAddressFromInputs,
    getMetadataFromNftOutput,
    getNftId,
} from '..'
import { ActivityDirection, ActivityType } from '@core/wallet/enums'
import { OUTPUT_TYPE_NFT } from '@core/wallet/constants'
import { IAccountState } from '@core/account'
import type { INftOutput } from '@iota/types'
import { getAsyncDataFromOutput } from './getAsyncDataFromOutput'
import { getNftByIdFromAllAccountNfts } from '@core/wallet/stores'

export function getNftActivityData(
    processedTransaction: IProcessedTransaction,
    account: IAccountState
): INftActivityData {
    const { outputs, isIncoming, claimingData, detailedTransactionInputs, transactionId } = processedTransaction
    const wrappedOutput = getNftOutputFromTransaction(outputs)
    const outputId = wrappedOutput.outputId
    const output = wrappedOutput.output as INftOutput

    const nftId = getNftId(output.nftId, outputId)
    const storageDeposit = Number(output.amount)
    const nft = getNftByIdFromAllAccountNfts(account.index, nftId)
    const metadata = nft?.metadata ?? getMetadataFromNftOutput(output)

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
