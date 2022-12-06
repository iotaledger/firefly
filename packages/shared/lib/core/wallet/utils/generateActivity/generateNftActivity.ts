import { IAccountState } from '@core/account'
import { ActivityType } from '@core/wallet/enums'
import { NftActivity } from '@core/wallet/types'
import type { INftOutput } from '@iota/types'
import { IActivityGenerationParameters } from '..'
import { getNftId } from '../outputs/getNftId'
import { getAsyncDataFromOutput, getMetadataFromOutput, getSendingInformation, getTagFromOutput } from './helper'

export function generateNftActivity(
    account: IAccountState,
    { action, processedTransaction, wrappedOutput }: IActivityGenerationParameters
): NftActivity {
    const { claimingData, utxoInputs, time, inclusionState, transactionId, direction } = processedTransaction
    const outputId = wrappedOutput.outputId
    const output = wrappedOutput.output as INftOutput
    const id = outputId || transactionId

    const isHidden = false
    const isAssetHidden = false
    const containsValue = true

    const inputs = utxoInputs

    const nftId = getNftId(output.nftId, outputId)
    const storageDeposit = Number(output.amount)
    const giftedStorageDeposit = 0
    const metadata = getMetadataFromOutput(output)
    const tag = getTagFromOutput(output)

    const sendingInfo = getSendingInformation(processedTransaction, output, account)
    const { subject, isInternal } = sendingInfo

    const asyncData = getAsyncDataFromOutput(output, outputId, claimingData, account)

    return {
        type: ActivityType.Nft,
        id,
        transactionId,
        outputId,
        nftId,
        time,
        isHidden,
        action,
        giftedStorageDeposit,
        isAssetHidden,
        containsValue,
        inputs,
        inclusionState,
        storageDeposit,
        metadata,
        tag,
        asyncData,
        subject,
        isInternal,
        direction,
    }
}
