import { isShimmerClaimingTransaction } from '@contexts/onboarding'
import { IAccountState } from '@core/account'
import { COIN_TYPE } from '@core/network'
import { activeProfile, activeProfileId } from '@core/profile'
import { TransactionActivity } from '@core/wallet/types'
import { IBasicOutput } from '@iota/types'
import { get } from 'svelte/store'
import { ActivityAction, ActivityType } from '../../enums'
import { IProcessedTransaction } from '../../interfaces'
import { getNativeTokenFromOutput, getMainOutputFromTransaction, outputContainsValue } from '../../utils'
import {
    getAmountFromOutput,
    getAsyncDataFromOutput,
    getMetadataFromOutput,
    getSendingInformation,
    getStorageDepositFromOutput,
    getTagFromOutput,
} from './helper'

export function generateTransactionActivity(
    processedTransaction: IProcessedTransaction,
    account: IAccountState
): TransactionActivity {
    const { outputs, transactionId, direction, claimingData, time, inclusionState, transactionInputs } =
        processedTransaction

    const isHidden = false
    const isAssetHidden = false
    const containsValue = outputContainsValue(processedTransaction, account)

    const inputs = transactionInputs

    const wrappedOutput = getMainOutputFromTransaction(outputs, account.depositAddress, direction)
    const outputId = wrappedOutput.outputId
    const id = outputId || transactionId

    const output = wrappedOutput.output as IBasicOutput

    const isShimmerClaiming = isShimmerClaimingTransaction(transactionId, get(activeProfileId))

    const nativeToken = getNativeTokenFromOutput(output)
    const assetId = nativeToken?.id ?? String(COIN_TYPE[get(activeProfile).networkProtocol])

    const { storageDeposit, giftedStorageDeposit } = getStorageDepositFromOutput(output)
    const rawAmount = nativeToken ? Number(nativeToken?.amount) : getAmountFromOutput(output) - storageDeposit
    const metadata = getMetadataFromOutput(output)
    const tag = getTagFromOutput(output)
    const publicNote = ''

    const action = ActivityAction.Send

    const sendingInfo = getSendingInformation(processedTransaction, output, account)
    const asyncData = getAsyncDataFromOutput(output, transactionId, claimingData, account)

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
        ...sendingInfo,
    }
}
