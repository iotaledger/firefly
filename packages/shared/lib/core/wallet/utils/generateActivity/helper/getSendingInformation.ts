import { IAccountState } from '@core/account'
import { ActivityDirection } from '@core/wallet/enums'
import { IProcessedTransaction } from '@core/wallet/interfaces'
import { Output, Subject } from '@core/wallet/types'
import { getSubjectFromAddress } from '../../getSubjectFromAddress'
import { isSubjectInternal } from '../../isSubjectInternal'
import { getRecipientFromOutput } from '../../outputs'
import { getSenderAddressFromInputs, getSenderFromTransaction } from '../../transactions'

export function getSendingInformation(
    processedTransaction: IProcessedTransaction,
    output: Output,
    account: IAccountState,
    isOnlyOutput?: boolean
): {
    subject: Subject
    direction: ActivityDirection
    isInternal: boolean
} {
    const { isIncoming, detailedTransactionInputs } = processedTransaction

    const recipient = getRecipientFromOutput(output)
    const sender = detailedTransactionInputs
        ? getSubjectFromAddress(getSenderAddressFromInputs(detailedTransactionInputs))
        : getSenderFromTransaction(isIncoming, account.depositAddress, output)

    const subject = isIncoming ? sender : recipient
    const isInternal = isSubjectInternal(subject)

    let isSelfTransaction = false
    if (recipient?.type === 'account' && sender?.type === 'account') {
        isSelfTransaction = recipient.account === sender.account
    } else if (recipient?.type === 'address' && sender?.type === 'address') {
        isSelfTransaction = recipient.address === sender.address
    }

    let direction = undefined
    if (isSelfTransaction || isOnlyOutput) {
        direction = ActivityDirection.SelfTransaction
    } else if (isIncoming) {
        direction = ActivityDirection.Incoming
    } else {
        direction = ActivityDirection.Outgoing
    }

    return {
        subject,
        isInternal,
        direction,
    }
}
