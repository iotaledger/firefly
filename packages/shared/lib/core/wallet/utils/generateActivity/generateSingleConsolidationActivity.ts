import { IWalletState } from '@core/wallet/interfaces'
import { IActivityGenerationParameters, IWrappedOutput } from '@core/wallet/interfaces'
import { ConsolidationActivity } from '@core/wallet/types'
import { ActivityType } from '../../enums'
import { activityOutputContainsValue } from '..'
import {
    getAsyncDataFromOutput,
    getMetadataFromOutput,
    getSendingInformation,
    getStorageDepositFromOutput,
    getTagFromOutput,
} from './helper'
import { BasicOutput, OutputType } from '@iota/sdk/out/types'

export async function generateSingleConsolidationActivity(
    wallet: IWalletState,
    { action, processedTransaction, wrappedOutput }: IActivityGenerationParameters
): Promise<ConsolidationActivity> {
    const { transactionId, direction, claimingData, time, inclusionState, wrappedInputs, mana } = processedTransaction

    const isHidden = false
    const isAssetHidden = false
    const containsValue = await activityOutputContainsValue(wallet, wrappedOutput)

    const outputId = wrappedOutput.outputId
    const id = outputId || transactionId

    const output = wrappedOutput.output as BasicOutput

    const amountConsolidatedInputs = getAmountOfConsolidationInputs(wrappedInputs)

    const tag = getTagFromOutput(output)
    const metadata = getMetadataFromOutput(output)

    const sendingInfo = getSendingInformation(processedTransaction, output, wallet)
    const asyncData = await getAsyncDataFromOutput(output, outputId, claimingData, wallet)

    const { storageDeposit, giftedStorageDeposit } = await getStorageDepositFromOutput(output)
    return {
        type: ActivityType.Consolidation,
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
        storageDeposit,
        giftedStorageDeposit,
        metadata,
        tag,
        asyncData,
        amountConsolidatedInputs,
        mana,
        ...sendingInfo,
    }
}

function getAmountOfConsolidationInputs(inputs: IWrappedOutput[]): number {
    return inputs.filter((input) => input.output.type === OutputType.Basic).length
}
