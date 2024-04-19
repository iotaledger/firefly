import { ActivityType } from '@core/wallet/enums'
import { IActivityGenerationParameters, IWalletState } from '@core/wallet/interfaces'
import { AnchorActivity } from '@core/wallet/types'
import {
    getAmountFromOutput,
    getAsyncDataFromOutput,
    getGovernorAddressFromAnchorOutput,
    getMetadataFromOutput,
    getSendingInformation,
    getStateControllerAddressFromAnchorOutput,
    getStorageDepositFromOutput,
    getTagFromOutput,
} from './helper'
import { AnchorOutput } from '@iota/sdk/out/types'

export async function generateSingleAnchorActivity(
    wallet: IWalletState,
    { action, processedTransaction, wrappedOutput }: IActivityGenerationParameters
): Promise<AnchorActivity> {
    const { transactionId, claimingData, direction, time, inclusionState, mana } = processedTransaction

    const output = wrappedOutput.output as AnchorOutput
    const outputId = wrappedOutput.outputId
    const id = outputId || transactionId

    const { storageDeposit: _storageDeposit, giftedStorageDeposit } = await getStorageDepositFromOutput(output)
    const storageDeposit = getAmountFromOutput(output) + _storageDeposit
    const governorAddress = getGovernorAddressFromAnchorOutput(output)
    const stateControllerAddress = getStateControllerAddressFromAnchorOutput(output)

    const isHidden = false
    const isAssetHidden = false
    const containsValue = true

    const metadata = getMetadataFromOutput(output)
    const tag = getTagFromOutput(output)
    const asyncData = await getAsyncDataFromOutput(output, outputId, claimingData, wallet)
    const sendingInfo = getSendingInformation(processedTransaction, output, wallet)

    return {
        type: ActivityType.Anchor,
        id,
        outputId,
        transactionId,
        direction,
        action,
        storageDeposit,
        giftedStorageDeposit,
        governorAddress,
        stateControllerAddress,
        isHidden,
        isAssetHidden,
        time,
        metadata,
        tag,
        inclusionState,
        containsValue,
        asyncData,
        mana,
        ...sendingInfo,
    }
}
