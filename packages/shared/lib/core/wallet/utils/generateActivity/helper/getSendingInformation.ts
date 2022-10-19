import { IAccountState } from '@core/account'
import { ActivityDirection } from '@core/wallet/enums'
import { IProcessedTransaction } from '@core/wallet/interfaces'
import { Subject } from '@core/wallet/types'
import { OutputTypes } from '@iota/types'
import { isSubjectInternal } from '../../isSubjectInternal'
import { getRecipientFromOutput } from '../../outputs'
import { getSenderFromInputs, getSenderFromTransaction } from '../../transactions'

export function getSendingInformation(
    processedTransaction: IProcessedTransaction,
    output: OutputTypes,
    account: IAccountState
): {
    sender: Subject
    recipient: Subject
    subject: Subject
    direction: ActivityDirection
    isInternal: boolean
    isSelfTransaction: boolean
} {
    const { isIncoming, detailedTransactionInputs } = processedTransaction

    const recipient = getRecipientFromOutput(output)
    const sender = detailedTransactionInputs
        ? getSenderFromInputs(detailedTransactionInputs)
        : getSenderFromTransaction(isIncoming, account.depositAddress, output)

    const subject = isIncoming ? sender : recipient
    const isInternal = isSubjectInternal(subject)

    let isSelfTransaction = false
    if (recipient?.type === 'account' && sender?.type === 'account') {
        isSelfTransaction = recipient.account === sender.account
    } else if (recipient?.type === 'address' && sender?.type === 'address') {
        isSelfTransaction = recipient.address === sender.address
    }

    const direction = isIncoming || isSelfTransaction ? ActivityDirection.Incoming : ActivityDirection.Outgoing

    return {
        recipient,
        sender,
        subject,
        isInternal,
        direction,
        isSelfTransaction,
    }
}
