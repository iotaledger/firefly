import { COIN_TYPE } from '@core/network'
import { activeProfile } from '@core/profile'
import { get } from 'svelte/store'
import { IProcessedTransaction } from '../../interfaces'
import {
    getNativeTokenFromOutput,
    getFoundryOutputFromTransaction,
    outputContainsValue,
    convertHexAddressToBech32,
} from '..'
import { ActivityAction, ActivityType } from '@core/wallet/enums'
import { FoundryActivity } from '@core/wallet/types'
import {
    getAmountFromOutput,
    getAsyncDataFromOutput,
    getMetadataFromOutput,
    getSendingInformation,
    getStorageDepositFromOutput,
    getTagFromOutput,
} from './helper'
import { IAccountState } from '@core/account'
import type { IAliasAddress, IFoundryOutput, IImmutableAliasUnlockCondition } from '@iota/types'
import { ADDRESS_TYPE_ALIAS, UNLOCK_CONDITION_IMMUTABLE_ALIAS } from '@core/wallet/constants'

export function generateFoundryActivity(
    processedTransaction: IProcessedTransaction,
    account: IAccountState
): FoundryActivity {
    const { outputs, transactionId, claimingData, transactionInputs, time, direction, inclusionState } =
        processedTransaction
    const wrappedOutput = getFoundryOutputFromTransaction(outputs)

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
    const containsValue = outputContainsValue(processedTransaction, account)

    const inputs = transactionInputs

    const id = outputId || transactionId
    const nativeToken = getNativeTokenFromOutput(output)
    const assetId = nativeToken?.id ?? String(COIN_TYPE[get(activeProfile).networkProtocol])

    const { storageDeposit, giftedStorageDeposit } = getStorageDepositFromOutput(output) // probably we need to sum up all storage deposits
    const rawAmount = nativeToken ? Number(nativeToken?.amount) : getAmountFromOutput(output) - storageDeposit
    const metadata = getMetadataFromOutput(output)
    const tag = getTagFromOutput(output)

    const action = ActivityAction.Mint
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
