import { isShimmerClaimingTransaction } from '@contexts/onboarding'
import { IAccountState } from '@core/account'
import { COIN_TYPE } from '@core/network'
import { activeProfile, activeProfileId } from '@core/profile'
import { get } from 'svelte/store'
import { ActivityDirection, ActivityType } from '../../enums'
import { IProcessedTransaction, ITransactionActivityData } from '../../interfaces'
import {
    getAmountFromOutput,
    getMetadataFromOutput,
    getNativeTokenFromOutput,
    getRecipientFromOutput,
    getStorageDepositFromOutput,
    getTagFromOutput,
    isSubjectInternal,
    getSenderFromTransaction,
    getSenderAddressFromInputs,
    getMainTransactionOutputFromTransaction,
    getSubjectFromAddress,
} from '../../utils'
import { getAsyncDataFromOutput } from './getAsyncDataFromOutput'

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
        ? getSubjectFromAddress(getSenderAddressFromInputs(detailedTransactionInputs))
        : getSenderFromTransaction(isIncoming, account.depositAddress, output)

    const subject = isIncoming ? sender : recipient
    const isInternal = isSubjectInternal(subject)

    const direction = isIncoming || isSelfTransaction ? ActivityDirection.Incoming : ActivityDirection.Outgoing

    const asyncData = getAsyncDataFromOutput(output, transactionId, claimingData, account)

    const isShimmerClaiming = isShimmerClaimingTransaction(transactionId, get(activeProfileId))

    const nativeToken = getNativeTokenFromOutput(output)
    const assetId = nativeToken?.id ?? String(COIN_TYPE[get(activeProfile).networkProtocol])

    const { storageDeposit, giftedStorageDeposit } = getStorageDepositFromOutput(output)
    const rawAmount = nativeToken ? Number(nativeToken?.amount) : getAmountFromOutput(output) - storageDeposit

    const metadata = getMetadataFromOutput(output)
    const tag = getTagFromOutput(output)
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
        isShimmerClaiming,
        publicNote,
        metadata,
        tag,
        assetId,
        ...asyncData,
    }
}
