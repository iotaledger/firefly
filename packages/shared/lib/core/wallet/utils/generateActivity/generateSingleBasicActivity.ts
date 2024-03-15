import { isShimmerClaimingTransaction } from '@contexts/onboarding/stores'
import { IWalletState } from '@core/wallet/interfaces'
import { activeProfileId, getCoinType } from '@core/profile'
import { IActivityGenerationParameters } from '@core/wallet/interfaces'
import { BaseActivity } from '@core/wallet/types'
import { get } from 'svelte/store'
import { activityOutputContainsValue, getNativeTokenFromOutput } from '..'
import { ActivityAction, ActivityType } from '../../enums'
import {
    getAmountFromOutput,
    getAsyncDataFromOutput,
    getLayer2ActivityInformation,
    getMetadataFromOutput,
    getSendingInformation,
    getStorageDepositFromOutput,
    getTagFromOutput,
} from './helper'
import { BasicOutput } from '@iota/sdk/out/types'

export async function generateSingleBasicActivity(
    wallet: IWalletState,
    { action, processedTransaction, wrappedOutput }: IActivityGenerationParameters,
    fallbackAssetId?: string,
    fallbackAmount?: number
): Promise<BaseActivity> {
    const { transactionId, direction, claimingData, time, inclusionState } = processedTransaction

    const isHidden = false
    const isAssetHidden = false
    const containsValue = await activityOutputContainsValue(wallet, wrappedOutput)

    const outputId = wrappedOutput.outputId
    const id = outputId || transactionId

    const output = wrappedOutput.output as BasicOutput
    const amount = getAmountFromOutput(output)

    const isShimmerClaiming = isShimmerClaimingTransaction(transactionId, get(activeProfileId))

    const tag = getTagFromOutput(output)
    const metadata = getMetadataFromOutput(output)
    const sendingInfo = getSendingInformation(processedTransaction, output, wallet)
    const asyncData = await getAsyncDataFromOutput(output, outputId, claimingData, wallet)

    const { parsedLayer2Metadata, destinationNetwork } = getLayer2ActivityInformation(metadata, sendingInfo)
    const layer2Allowance = Number(parsedLayer2Metadata?.baseTokens ?? '0')
    const gasBudget = Number(parsedLayer2Metadata?.gasBudget ?? '0')
    const gasFee = layer2Allowance > 0 ? amount - layer2Allowance : 0

    let { storageDeposit, giftedStorageDeposit } = await getStorageDepositFromOutput(output)
    giftedStorageDeposit = action === ActivityAction.Burn ? 0 : giftedStorageDeposit
    giftedStorageDeposit = gasBudget === 0 ? giftedStorageDeposit : 0

    const baseTokenAmount = amount - storageDeposit - gasFee

    const nativeToken = getNativeTokenFromOutput(output)
    const assetId = fallbackAssetId ?? nativeToken?.id ?? getCoinType()

    let surplus: number | undefined = undefined
    if (nativeToken) {
        const storageDepositToDeduct = (storageDeposit > 0 ? storageDeposit : giftedStorageDeposit) ?? 0
        surplus = Number(output.amount) - storageDepositToDeduct
    }

    let rawAmount: number
    if (fallbackAmount === undefined) {
        rawAmount = nativeToken ? Number(nativeToken?.amount) : baseTokenAmount
    } else {
        rawAmount = fallbackAmount
    }

    // Note: we update the displayed storage deposit so it matches what was displayed in the send confirmation flow
    // set the storage deposit to zero if the amount is greater than the storage deposit
    // to improve the UX so the user doesnt think they need to pay the storage deposit
    if (!nativeToken && !storageDeposit && rawAmount >= giftedStorageDeposit) {
        storageDeposit = giftedStorageDeposit = 0
    }

    return {
        type: ActivityType.Transaction,
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
        surplus,
        rawAmount,
        isShimmerClaiming,
        metadata,
        tag,
        assetId,
        asyncData,
        destinationNetwork,
        parsedLayer2Metadata,
        ...sendingInfo,
    }
}
