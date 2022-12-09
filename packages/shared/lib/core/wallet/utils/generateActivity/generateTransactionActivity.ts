import { isShimmerClaimingTransaction } from '@contexts/onboarding'
import { IAccountState } from '@core/account'
import {
    DestinationNetwork,
    getDestinationNetworkFromAddress,
    Layer2Metadata,
    parseLayer2Metadata,
} from '@core/layer-2'
import { COIN_TYPE } from '@core/network'
import { activeProfile, activeProfileId } from '@core/profile'
import { TransactionActivity } from '@core/wallet/types'
import { IBasicOutput } from '@iota/types'
import { get } from 'svelte/store'
import { ActivityType } from '../../enums'
import { activityOutputContainsValue, getNativeTokenFromOutput, IActivityGenerationParameters } from '../../utils'
import {
    getAmountFromOutput,
    getAsyncDataFromOutput,
    getMetadataFromOutput,
    getSendingInformation,
    getStorageDepositFromOutput,
    getTagFromOutput,
} from './helper'

export function generateTransactionActivity(
    account: IAccountState,
    { type, action, processedTransaction, wrappedOutput }: IActivityGenerationParameters
): TransactionActivity {
    const { transactionId, direction, claimingData, time, inclusionState, utxoInputs } = processedTransaction

    const isHidden = false
    const isAssetHidden = false
    const containsValue = activityOutputContainsValue(type, wrappedOutput)

    const inputs = utxoInputs

    const outputId = wrappedOutput.outputId
    const id = outputId || transactionId

    const output = wrappedOutput.output as IBasicOutput

    const isShimmerClaiming = isShimmerClaimingTransaction(transactionId, get(activeProfileId))

    const nativeToken = getNativeTokenFromOutput(output)
    const assetId = nativeToken?.id ?? String(COIN_TYPE[get(activeProfile).networkProtocol])

    const tag = getTagFromOutput(output)
    const metadata = getMetadataFromOutput(output)
    const publicNote = ''

    const sendingInfo = getSendingInformation(processedTransaction, output, account)
    const asyncData = getAsyncDataFromOutput(output, outputId, claimingData, account)

    let parsedLayer2Metadata: Layer2Metadata
    let destinationNetwork: string
    try {
        parsedLayer2Metadata = parseLayer2Metadata(metadata)
        destinationNetwork = getDestinationNetworkFromAddress(
            sendingInfo.subject.type === 'address' ? sendingInfo.subject.address : undefined
        )
    } catch (_) {
        parsedLayer2Metadata = null
        destinationNetwork = DestinationNetwork.Shimmer
    }

    const { storageDeposit, giftedStorageDeposit } = getStorageDepositFromOutput(output)
    const gasBudget = Number(parsedLayer2Metadata?.gasBudget ?? '0')
    const baseTokenAmount = getAmountFromOutput(output) - storageDeposit - gasBudget
    const rawAmount = nativeToken ? Number(nativeToken?.amount) : baseTokenAmount
    return {
        type: ActivityType.Basic,
        isHidden,
        id,
        transactionId,
        time,
        direction,
        action,
        isAssetHidden,
        inclusionState,
        inputs,
        containsValue,
        outputId,
        storageDeposit,
        giftedStorageDeposit,
        rawAmount,
        isShimmerClaiming,
        publicNote,
        metadata,
        tag,
        assetId,
        asyncData,
        destinationNetwork,
        parsedLayer2Metadata,
        ...sendingInfo,
    }
}
