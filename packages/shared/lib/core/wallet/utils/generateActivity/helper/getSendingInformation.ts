import { IAccountState } from '@core/account'
import { ActivityDirection } from '@core/wallet/enums'
import { IProcessedTransaction } from '@core/wallet/interfaces'
import { Subject } from '@core/wallet/types'
import { IBasicOutput, IAliasOutput, IFoundryOutput, INftOutput } from '@iota/types'
import { getSubjectFromAddress } from '../../getSubjectFromAddress'
import { isSubjectInternal } from '../../isSubjectInternal'
import { getRecipientFromOutput } from '../../outputs'
import { getSenderAddressFromInputs, getSenderFromTransaction } from '../../transactions'

export function getSendingInformation(
    processedTransaction: IProcessedTransaction,
    output: IBasicOutput | IAliasOutput | IFoundryOutput | INftOutput,
    account: IAccountState
): {
    subject: Subject
    direction: ActivityDirection
    isInternal: boolean
    isSelfTransaction: boolean
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

    const direction = isIncoming || isSelfTransaction ? ActivityDirection.Incoming : ActivityDirection.Outgoing

    return {
        subject,
        isInternal,
        direction,
        isSelfTransaction,
    }
}
