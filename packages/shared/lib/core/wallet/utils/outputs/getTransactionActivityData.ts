import { isShimmerClaimingTransaction } from '@contexts/onboarding'
import { IAccountState } from '@core/account'
import { COIN_TYPE } from '@core/network'
import { activeProfile, activeProfileId } from '@core/profile'
import { get } from 'svelte/store'
import { ActivityAsyncStatus, ActivityDirection, ActivityType } from '../../enums'
import { IProcessedTransaction, ITransactionActivityData } from '../../interfaces'
import { isActivityHiddenForAccountId } from '../../stores/hidden-activities.store'
import {
    getAmountFromOutput,
    getExpirationDateFromOutput,
    getMetadataFromOutput,
    getNativeTokenFromOutput,
    getRecipientFromOutput,
    getStorageDepositFromOutput,
    getTagFromOutput,
    isOutputAsync,
    isSubjectInternal,
    getSenderFromTransaction,
    getSenderFromInputs,
    getMainTransactionOutputFromTransaction,
    getTimelockDateFromOutput,
} from '../../utils'

export function getTransactionActivityData(
    processedTransaction: IProcessedTransaction,
    account: IAccountState
): ITransactionActivityData {
    const { outputs, transactionId, isIncoming, detailedTransactionInputs, claimingData } = processedTransaction

    const { wrappedOutput, isSelfTransaction } = getMainTransactionOutputFromTransaction(
        outputs,
        account.depositAddress,
        isIncoming
    )
    const outputId = wrappedOutput.outputId

    const { output } = wrappedOutput
    const recipient = getRecipientFromOutput(output)
    const sender = detailedTransactionInputs
        ? getSenderFromInputs(detailedTransactionInputs)
        : getSenderFromTransaction(isIncoming, account.depositAddress, output)

    const subject = isIncoming ? sender : recipient
    const isInternal = isSubjectInternal(subject)

    const direction = isIncoming || isSelfTransaction ? ActivityDirection.In : ActivityDirection.Out

    const isAsync = isOutputAsync(output)
    const asyncStatus = isAsync ? ActivityAsyncStatus.Unclaimed : null
    const isClaimed = !!claimingData
    const isClaiming = false
    const claimingTransactionId = claimingData?.claimingTransactionId
    const claimedDate = claimingData?.claimedDate

    const isShimmerClaiming = isShimmerClaimingTransaction(transactionId, get(activeProfileId))

    const nativeToken = getNativeTokenFromOutput(output)
    const assetId = nativeToken?.id ?? String(COIN_TYPE[get(activeProfile).networkProtocol])
    const isRejected = isActivityHiddenForAccountId(account.id, transactionId)

    const { storageDeposit, giftedStorageDeposit } = getStorageDepositFromOutput(output)
    const rawAmount = nativeToken ? Number(nativeToken?.amount) : getAmountFromOutput(output) - storageDeposit

    const metadata = getMetadataFromOutput(output)
    const tag = getTagFromOutput(output)
    const expirationDate = getExpirationDateFromOutput(output)
    const timelockDate = getTimelockDateFromOutput(output)
    const publicNote = ''

    return {
        type: ActivityType.Transaction,
        direction,
        outputId,
        isInternal,
        storageDeposit,
        giftedStorageDeposit,
        rawAmount,
        sender,
        recipient,
        subject,
        isSelfTransaction,
        isAsync,
        asyncStatus,
        expirationDate,
        timelockDate,
        isRejected,
        isClaiming,
        isClaimed,
        isShimmerClaiming,
        publicNote,
        claimingTransactionId,
        claimedDate,
        metadata,
        tag,
        assetId,
    }
}
