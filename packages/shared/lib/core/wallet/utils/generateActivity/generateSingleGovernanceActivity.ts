import { IWalletState } from '@core/wallet/interfaces'
import { IActivityGenerationParameters } from '@core/wallet/interfaces'
import { GovernanceActivity } from '@core/wallet/types'
import { ActivityType } from '../../enums'
import { activityOutputContainsValue } from '..'
import {
    getAmountFromOutput,
    getGovernanceInfo,
    getMetadataFromOutput,
    getSendingInformation,
    getStorageDepositFromOutput,
    getTagFromOutput,
} from './helper'
import { BasicOutput } from '@iota/sdk/out/types'

export async function generateSingleGovernanceActivity(
    wallet: IWalletState,
    { action, processedTransaction, wrappedOutput }: IActivityGenerationParameters
): Promise<GovernanceActivity> {
    const { transactionId, direction, time, inclusionState, wrappedInputs } = processedTransaction

    const isHidden = false
    const isAssetHidden = false
    const containsValue = await activityOutputContainsValue(wallet, wrappedOutput)

    const outputId = wrappedOutput.outputId
    const id = outputId || transactionId

    const output = wrappedOutput.output as BasicOutput

    const tag = getTagFromOutput(output)
    const metadata = getMetadataFromOutput(output)

    const sendingInfo = getSendingInformation(processedTransaction, output, wallet)

    const { storageDeposit } = await getStorageDepositFromOutput(wallet, output)
    const votingPower = getAmountFromOutput(output)
    const governanceInfo = getGovernanceInfo(output, wrappedInputs, metadata)

    return {
        type: ActivityType.Governance,
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
        giftedStorageDeposit: 0,
        votingPower,
        metadata,
        tag,
        asyncData: null,
        ...governanceInfo,
        ...sendingInfo,
    }
}
