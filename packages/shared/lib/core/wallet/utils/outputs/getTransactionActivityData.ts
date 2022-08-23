import { IAccountState } from '@core/account'
import { COIN_TYPE } from '@core/network'
import { activeProfile } from '@core/profile'
import { get } from 'svelte/store'
import { ActivityAsyncStatus, ActivityDirection } from '../../enums'
import { IProcessedTransaction, TransactionActivityData } from '../../interfaces'
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
    outputIdFromTransactionData,
    getSenderFromTransaction,
    getSenderFromInputs,
    getMainTransactionOutputFromTransaction,
} from '../../utils'

export function getTransactionActivityData(
    processedTransaction: IProcessedTransaction,
    account: IAccountState
): TransactionActivityData {
    const { outputs, transactionId, isIncoming, detailedTransactionInputs } = processedTransaction

    const { output, outputIndex, isSelfTransaction } = getMainTransactionOutputFromTransaction(
        outputs,
        account.depositAddress,
        isIncoming
    )
    const outputId = outputIdFromTransactionData(transactionId, outputIndex) // Only required for async transactions e.g. when claimed or to get the full output with `getOutput`

    const recipient = getRecipientFromOutput(output)
    const sender = detailedTransactionInputs
        ? getSenderFromInputs(detailedTransactionInputs)
        : getSenderFromTransaction(isIncoming, account.depositAddress, output)

    const subject = isIncoming ? sender : recipient
    const isInternal = isSubjectInternal(subject)

    const direction = isIncoming || isSelfTransaction ? ActivityDirection.In : ActivityDirection.Out

    const isAsync = isOutputAsync(output)
    const asyncStatus = isAsync ? ActivityAsyncStatus.Unclaimed : null
    const isClaimed = false
    const isClaiming = false
    const claimingTransactionId = undefined
    const claimedDate = undefined

    const nativeToken = getNativeTokenFromOutput(output)

    const assetId = nativeToken?.id ?? String(COIN_TYPE[get(activeProfile).networkProtocol])
    const isRejected = isActivityHiddenForAccountId(account.id, transactionId)

    const { storageDeposit, giftedStorageDeposit } = getStorageDepositFromOutput(output)
    const rawAmount = nativeToken ? Number(nativeToken?.amount) : getAmountFromOutput(output) - storageDeposit

    const metadata = getMetadataFromOutput(output)
    const tag = getTagFromOutput(output)
    const expirationDate = getExpirationDateFromOutput(output)
    const publicNote = ''

    return {
        type: 'transaction',
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
        isRejected,
        isClaiming,
        isClaimed,
        publicNote,
        claimingTransactionId,
        claimedDate,
        metadata,
        tag,
        assetId,
    }
}
