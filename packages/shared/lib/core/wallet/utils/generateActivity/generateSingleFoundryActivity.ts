import { IAccountState } from '@core/account'
import { getCoinType } from '@core/profile'
import { ActivityType } from '@core/wallet/enums'
import { IActivityGenerationParameters } from '@core/wallet/interfaces'
import { FoundryActivity } from '@core/wallet/types'
import { convertHexAddressToBech32, getNativeTokenFromOutput } from '..'
import {
    getAmountFromOutput,
    getAsyncDataFromOutput,
    getMetadataFromOutput,
    getSendingInformation,
    getTagFromOutput,
} from './helper'
import {
    AddressType,
    AliasAddress,
    FoundryOutput,
    ImmutableAliasAddressUnlockCondition,
    SimpleTokenScheme,
    UnlockConditionType,
} from '@iota/wallet'

export async function generateSingleFoundryActivity(
    account: IAccountState,
    { action, processedTransaction, wrappedOutput }: IActivityGenerationParameters
): Promise<FoundryActivity> {
    const { transactionId, claimingData, time, direction, inclusionState } = processedTransaction

    const output = wrappedOutput.output as FoundryOutput
    const outputId = wrappedOutput.outputId
    const tokenScheme = output.getTokenScheme() as SimpleTokenScheme
    const mintedTokens = tokenScheme.getMintedTokens()
    const meltedTokens = tokenScheme.getMeltedTokens()
    const maximumSupply = tokenScheme.getMaximumSupply()

    const addressUnlockCondition = output
        .getUnlockConditions()
        .find(
            (unlockCondition) => unlockCondition.getType() === UnlockConditionType.ImmutableAliasAddress
        ) as ImmutableAliasAddressUnlockCondition
    const aliasId = (addressUnlockCondition?.getAddress() as AliasAddress)?.getAliasId()
    const aliasAddress = aliasId ? convertHexAddressToBech32(AddressType.Alias, aliasId) : undefined

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
