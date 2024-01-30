import { ActivityType } from '@core/wallet/enums'
import { IActivityGenerationParameters, IWalletState } from '@core/wallet/interfaces'
import { AnchorActivity } from '@core/wallet/types'
import {
    getAmountFromOutput,
    getAsyncDataFromOutput,
    getGovernorAddressFromAliasOutput,
    getMetadataFromOutput,
    getSendingInformation,
    getStateControllerAddressFromAliasOutput,
    getStorageDepositFromOutput,
    getTagFromOutput,
} from './helper'
import { AnchorOutput } from 'shared/../../../iota-sdk/bindings/nodejs/out'

export async function generateSingleAnchorActivity(
    wallet: IWalletState,
    { action, processedTransaction, wrappedOutput }: IActivityGenerationParameters
): Promise<AnchorActivity> {
    const { transactionId, claimingData, direction, time, inclusionState } = processedTransaction

    const output = wrappedOutput.output as AnchorOutput
    const outputId = wrappedOutput.outputId
    const id = outputId || transactionId

    const { storageDeposit: _storageDeposit, giftedStorageDeposit } = await getStorageDepositFromOutput(wallet, output)
    const storageDeposit = getAmountFromOutput(output) + _storageDeposit
    const governorAddress = getGovernorAddressFromAliasOutput(output)
    const stateControllerAddress = getStateControllerAddressFromAliasOutput(output)

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
        ...sendingInfo,
    }
}
