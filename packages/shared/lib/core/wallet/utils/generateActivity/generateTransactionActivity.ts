import { isShimmerClaimingTransaction } from '@contexts/onboarding'
import { IAccountState } from '@core/account'
import { COIN_TYPE } from '@core/network'
import { activeProfile, activeProfileId } from '@core/profile'
import { TransactionActivity } from '@core/wallet/types'
import { get } from 'svelte/store'
import { ActivityType } from '../../enums'
import { IProcessedTransaction } from '../../interfaces'
import { getNativeTokenFromOutput, getMainTransactionOutputFromTransaction, outputContainsValue } from '../../utils'
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
    const { outputs, transactionId, isIncoming, claimingData, time, inclusionState, transactionInputs } =
        processedTransaction

    const isHidden = false
    const isAssetHidden = false
    const containsValue = outputContainsValue(processedTransaction, account)

    const inputs = transactionInputs

    const { wrappedOutput, isSelfTransaction } = getMainTransactionOutputFromTransaction(
        outputs,
        account.depositAddress,
        isIncoming
    )
    const outputId = wrappedOutput.outputId
    const id = outputId || transactionId

    const { output } = wrappedOutput

    const isShimmerClaiming = isShimmerClaimingTransaction(transactionId, get(activeProfileId))

    const nativeToken = getNativeTokenFromOutput(output)
    const assetId = nativeToken?.id ?? String(COIN_TYPE[get(activeProfile).networkProtocol])

    const { storageDeposit, giftedStorageDeposit } = getStorageDepositFromOutput(output)
    const rawAmount = nativeToken ? Number(nativeToken?.amount) : getAmountFromOutput(output) - storageDeposit
    const metadata = getMetadataFromOutput(output)
    const tag = getTagFromOutput(output)
    const publicNote = ''

    const sendingInfo = getSendingInformation(processedTransaction, output, account)
    const asyncData = getAsyncDataFromOutput(output, transactionId, claimingData, account)

    return {
        type: ActivityType.Transaction,
        isHidden,
        id,
        transactionId,
        time,
        isAssetHidden,
        inclusionState,
        inputs,
        containsValue,
        outputId,
        storageDeposit,
        giftedStorageDeposit,
        rawAmount,
        isSelfTransaction,
        isShimmerClaiming,
        publicNote,
        metadata,
        tag,
        assetId,
        ...sendingInfo,
        ...asyncData,
    }
}
