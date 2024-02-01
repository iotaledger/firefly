import { IWalletState } from '@core/wallet/interfaces'
import { IActivityGenerationParameters } from '@core/wallet/interfaces'
import { VestingActivity } from '@core/wallet/types'
import { ActivityType } from '../../enums'
import { activityOutputContainsValue } from '..'
import {
    getAmountFromOutput,
    getAsyncDataFromOutput,
    getLayer2ActivityInformation,
    getMetadataFromOutput,
    getSendingInformation,
    getStorageDepositFromOutput,
    getTagFromOutput,
} from './helper'
import { BasicOutput } from '@iota/sdk/out/types'
import { getCoinType } from '@core/profile'

export async function generateVestingActivity(
    wallet: IWalletState,
    { action, processedTransaction, wrappedOutput }: IActivityGenerationParameters
): Promise<VestingActivity> {
    const { transactionId, direction, claimingData, time, inclusionState } = processedTransaction

    const isHidden = false
    const isAssetHidden = false
    const containsValue = await activityOutputContainsValue(wallet, wrappedOutput)

    const outputId = wrappedOutput.outputId
    const id = outputId || transactionId

    const output = wrappedOutput.output as BasicOutput

    const tag = getTagFromOutput(output)
    const metadata = getMetadataFromOutput(output)

    const sendingInfo = getSendingInformation(processedTransaction, output, wallet)
    const asyncData = await getAsyncDataFromOutput(output, outputId, claimingData, wallet)

    const { parsedLayer2Metadata, destinationNetwork } = getLayer2ActivityInformation(metadata, sendingInfo)

    const { storageDeposit, giftedStorageDeposit } = await getStorageDepositFromOutput(output)
    const rawAmount = getAmountFromOutput(output) - storageDeposit

    const assetId = getCoinType()

    return {
        type: ActivityType.Vesting,
        isHidden,
        id,
        transactionId,
        time,
        direction,
        action,
        isAssetHidden,
        inclusionState,
        containsValue,
        outputId,
        assetId,
        storageDeposit,
        giftedStorageDeposit,
        rawAmount,
        metadata,
        tag,
        asyncData,
        destinationNetwork,
        ...sendingInfo,
        ...parsedLayer2Metadata,
    }
}
