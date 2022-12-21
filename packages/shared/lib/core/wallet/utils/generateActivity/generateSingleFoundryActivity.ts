import { IAccountState } from '@core/account'
import { COIN_TYPE } from '@core/network'
import { activeProfile } from '@core/profile'
import { ADDRESS_TYPE_ALIAS, UNLOCK_CONDITION_IMMUTABLE_ALIAS } from '@core/wallet/constants'
import { ActivityType } from '@core/wallet/enums'
import { IActivityGenerationParameters } from '@core/wallet/interfaces'
import { FoundryActivity } from '@core/wallet/types'
import type { IAliasAddress, IFoundryOutput, IImmutableAliasUnlockCondition } from '@iota/types'
import { get } from 'svelte/store'
import { convertHexAddressToBech32, getNativeTokenFromOutput } from '..'
import {
    getAmountFromOutput,
    getAsyncDataFromOutput,
    getMetadataFromOutput,
    getSendingInformation,
    getStorageDepositFromOutput,
    getTagFromOutput,
} from './helper'

export function generateSingleFoundryActivity(
    account: IAccountState,
    { action, processedTransaction, wrappedOutput }: IActivityGenerationParameters
): FoundryActivity {
    const { transactionId, claimingData, utxoInputs, time, direction, inclusionState } = processedTransaction

    const output = wrappedOutput.output as IFoundryOutput
    const outputId = wrappedOutput.outputId
    const { mintedTokens, meltedTokens, maximumSupply } = output.tokenScheme

    const addressUnlockCondition = output.unlockConditions.find(
        (unlockCondition) => unlockCondition.type === UNLOCK_CONDITION_IMMUTABLE_ALIAS
    ) as IImmutableAliasUnlockCondition
    const aliasId = (addressUnlockCondition?.address as IAliasAddress)?.aliasId
    const aliasAddress = aliasId ? convertHexAddressToBech32(ADDRESS_TYPE_ALIAS, aliasId) : undefined

    const isHidden = false
    const isAssetHidden = false
    const containsValue = true

    const inputs = utxoInputs

    const id = outputId || transactionId
    const nativeToken = getNativeTokenFromOutput(output)
    const assetId = nativeToken?.id ?? String(COIN_TYPE[get(activeProfile).networkProtocol])

    const { storageDeposit, giftedStorageDeposit } = getStorageDepositFromOutput(output) // probably we need to sum up all storage deposits
    const rawAmount = nativeToken ? Number(nativeToken?.amount) : getAmountFromOutput(output) - storageDeposit
    const metadata = getMetadataFromOutput(output)
    const tag = getTagFromOutput(output)

    const sendingInfo = getSendingInformation(processedTransaction, output, account)
    const asyncData = getAsyncDataFromOutput(output, outputId, claimingData, account)

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
        inputs,
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
