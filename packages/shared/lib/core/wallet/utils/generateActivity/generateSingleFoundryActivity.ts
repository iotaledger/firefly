import { getCoinType, getNetworkHrp } from '@core/profile'
import { ActivityType } from '@core/wallet/enums'
import { IActivityGenerationParameters, IWalletState } from '@core/wallet/interfaces'
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
    AccountAddress,
    FoundryOutput,
    ImmutableAccountAddressUnlockCondition,
    SimpleTokenScheme,
    UnlockConditionType,
} from '@iota/sdk/out/types'
import { api } from '@core/api'

export async function generateSingleFoundryActivity(
    wallet: IWalletState,
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
        (unlockCondition) => unlockCondition.type === UnlockConditionType.ImmutableAccountAddress
    ) as ImmutableAccountAddressUnlockCondition
    const accountId = (addressUnlockCondition?.address as AccountAddress)?.accountId
    const accountAddress = accountId ? api.accountIdToBech32(accountId, getNetworkHrp()) : undefined

    const isHidden = false
    const isAssetHidden = false
    const containsValue = true

    const id = outputId || transactionId
    const nativeToken = getNativeTokenFromOutput(output)
    const assetId = nativeToken?.id ?? getCoinType()

    const storageDeposit = getAmountFromOutput(output)
    const giftedStorageDeposit = 0
    const rawAmount = Number(nativeToken?.amount ?? 0)
    const metadata = getMetadataFromOutput(output)
    const tag = getTagFromOutput(output)

    const sendingInfo = getSendingInformation(processedTransaction, output, wallet)
    const asyncData = await getAsyncDataFromOutput(output, outputId, claimingData, wallet)

    return {
        type: ActivityType.Foundry,
        id,
        outputId,
        transactionId,
        direction,
        action,
        assetId,
        accountAddress,
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
