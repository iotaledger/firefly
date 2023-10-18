import { IAccountState } from '@core/account'
import { EMPTY_HEX_ID } from '@core/wallet/constants'
import { ActivityType } from '@core/wallet/enums'
import { IActivityGenerationParameters } from '@core/wallet/interfaces'
import { AliasActivity } from '@core/wallet/types'
import { api } from '@core/profile-manager'
import { getNetworkHrp } from '@core/profile'
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
import { AliasOutput } from '@iota/sdk/out/types'

export async function generateSingleAliasActivity(
    account: IAccountState,
    { action, processedTransaction, wrappedOutput }: IActivityGenerationParameters
): Promise<AliasActivity> {
    const { transactionId, claimingData, direction, time, inclusionState } = processedTransaction

    const output = wrappedOutput.output as AliasOutput
    const outputId = wrappedOutput.outputId
    const id = outputId || transactionId

    const { storageDeposit: _storageDeposit, giftedStorageDeposit } = await getStorageDepositFromOutput(account, output)
    const storageDeposit = getAmountFromOutput(output) + _storageDeposit
    const governorAddress = getGovernorAddressFromAliasOutput(output)
    const stateControllerAddress = getStateControllerAddressFromAliasOutput(output)
    const aliasId = getAliasId(output, outputId)

    const isHidden = false
    const isAssetHidden = false
    const containsValue = true

    const metadata = getMetadataFromOutput(output)
    const tag = getTagFromOutput(output)
    const asyncData = await getAsyncDataFromOutput(output, outputId, claimingData, account)
    const sendingInfo = getSendingInformation(processedTransaction, output, account)

    return {
        type: ActivityType.Alias,
        id,
        outputId,
        transactionId,
        direction,
        action,
        aliasId,
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

function getAliasId(output: AliasOutput, outputId: string): string {
    const isNewAlias = output.aliasId === EMPTY_HEX_ID
    const aliasId = isNewAlias ? api.computeAliasId(outputId) : output.aliasId
    return api.aliasIdToBech32(aliasId, getNetworkHrp())
}
