import { IAccountState } from '@core/account'
import { getCoinType, getNetworkHrp } from '@core/profile'
import { api } from '@core/profile-manager'
import { ActivityType } from '@core/wallet/enums'
import { IActivityGenerationParameters } from '@core/wallet/interfaces'
import { FoundryActivity } from '@core/wallet/types'
import { getNativeTokenFromOutput } from '..'
import {
    getAmountFromOutput,
    getAsyncDataFromOutput,
    getMetadataFromOutput,
    getSendingInformation,
    getTagFromOutput,
} from './helper'
import {
    AliasAddress,
    FoundryOutput,
    ImmutableAliasAddressUnlockCondition,
    SimpleTokenScheme,
    UnlockConditionType,
} from '@iota/sdk/out/types'

export async function generateSingleFoundryActivity(
    account: IAccountState,
    { action, processedTransaction, wrappedOutput }: IActivityGenerationParameters
): Promise<FoundryActivity> {
    const { transactionId, claimingData, time, direction, inclusionState } = processedTransaction

    const output = wrappedOutput.output as FoundryOutput
    const outputId = wrappedOutput.outputId
    const tokenScheme = output.tokenScheme as SimpleTokenScheme
    const mintedTokens = tokenScheme.mintedTokens.toString()
    const meltedTokens = tokenScheme.meltedTokens.toString()
    const maximumSupply = tokenScheme.maximumSupply.toString()

    const addressUnlockCondition = output.unlockConditions.find(
        (unlockCondition) => unlockCondition.type === UnlockConditionType.ImmutableAliasAddress
    ) as ImmutableAliasAddressUnlockCondition
    const aliasId = (addressUnlockCondition?.address as AliasAddress)?.aliasId
    const aliasAddress = aliasId ? api.aliasIdToBech32(aliasId, getNetworkHrp()) : undefined

    const isHidden = false
    const isAssetHidden = false
    const containsValue = true

    const id = outputId || transactionId
    const nativeToken = await getNativeTokenFromOutput(output)
    const assetId = nativeToken?.id ?? getCoinType()

    const storageDeposit = getAmountFromOutput(output)
    const giftedStorageDeposit = 0
    const rawAmount = Number(nativeToken?.amount ?? 0)
    const metadata = getMetadataFromOutput(output)
    const tag = getTagFromOutput(output)

    const sendingInfo = getSendingInformation(processedTransaction, output, account)
    const asyncData = await getAsyncDataFromOutput(output, outputId, claimingData, account)

    return {
        type: ActivityType.Foundry,
        id,
        outputId,
        transactionId,
        direction,
        action,
        assetId,
        aliasAddress,
        mintedTokens,
        meltedTokens,
        maximumSupply,
        storageDeposit,
        giftedStorageDeposit,
        rawAmount,
        time,
        inclusionState,
        containsValue,
        isAssetHidden,
        isHidden,
        metadata,
        tag,
        asyncData,
        ...sendingInfo,
    }
}
