import type { IAccountState } from '@core/account'
import { ActivityType } from '@core/wallet/enums'
import type { IActivityGenerationParameters } from '@core/wallet/interfaces'
import type { NftActivity } from '@core/wallet/types'
import type { INftOutput } from '@iota/types'
import { getNftId } from '../outputs/getNftId'
import {
    getAsyncDataFromOutput,
    getLayer2ActivityInformation,
    getMetadataFromOutput,
    getSendingInformation,
    getTagFromOutput,
} from './helper'

export function generateSingleNftActivity(
    account: IAccountState,
    { action, processedTransaction, wrappedOutput }: IActivityGenerationParameters,
    nftIdFromInput?: string
): NftActivity {
    const { claimingData, time, inclusionState, transactionId, direction } = processedTransaction
    const outputId = wrappedOutput.outputId
    const output = wrappedOutput.output as INftOutput
    const id = outputId || transactionId

    const isHidden = false
    const isAssetHidden = false
    const containsValue = true

    const nftId = nftIdFromInput ? nftIdFromInput : getNftId(output.nftId, outputId)
    const giftedStorageDeposit = 0
    const metadata = getMetadataFromOutput(output)
    const tag = getTagFromOutput(output)

    const sendingInfo = getSendingInformation(processedTransaction, output, account)
    const { subject, isInternal } = sendingInfo

    const layer2ActivityInformation = getLayer2ActivityInformation(metadata, sendingInfo)
    const storageDeposit = Number(output.amount) - Number(layer2ActivityInformation?.parsedLayer2Metadata?.gasBudget)

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
        inclusionState,
        storageDeposit,
        metadata,
        tag,
        asyncData,
        subject,
        isInternal,
        direction,
        ...layer2ActivityInformation,
    }
}
