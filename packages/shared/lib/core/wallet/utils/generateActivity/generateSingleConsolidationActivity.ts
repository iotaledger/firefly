import { IAccountState } from '@core/account'
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
import { BasicOutput, OutputType } from '@iota/wallet/out/types'

export async function generateSingleConsolidationActivity(
    account: IAccountState,
    { action, processedTransaction, wrappedOutput }: IActivityGenerationParameters
): Promise<ConsolidationActivity> {
    const { transactionId, direction, claimingData, time, inclusionState, wrappedInputs } = processedTransaction

    const isHidden = false
    const isAssetHidden = false
    const containsValue = await activityOutputContainsValue(account, wrappedOutput)

    const outputId = wrappedOutput.outputId
    const id = outputId || transactionId

    const output = wrappedOutput.output as BasicOutput

    const amountConsolidatedInputs = getAmountOfConsolidationInputs(wrappedInputs)

    const tag = getTagFromOutput(output)
    const metadata = getMetadataFromOutput(output)

    const sendingInfo = getSendingInformation(processedTransaction, output, account)
    const asyncData = await getAsyncDataFromOutput(output, outputId, claimingData, account)

    const { storageDeposit, giftedStorageDeposit } = await getStorageDepositFromOutput(account, output)
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
        ...sendingInfo,
    }
}

function getAmountOfConsolidationInputs(inputs: IWrappedOutput[]): number {
    return inputs.filter((input) => input.output.getType() === OutputType.Basic).length
}
