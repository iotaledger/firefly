import { IAccountState } from '@core/account'
import { ActivityDirection } from '@core/wallet/enums'
import { IProcessedTransaction } from '@core/wallet/interfaces'
import { SenderInfo } from '@core/wallet/types'
import { getSubjectFromAddress } from '../../getSubjectFromAddress'
import { isSubjectInternal } from '../../isSubjectInternal'
import { getRecipientFromOutput } from '../../outputs'
import { getSenderAddressFromInputs, getSenderFromTransaction } from '../../transactions'
import { Output } from '@iota/wallet/out/types'

export function getSendingInformation(
    processedTransaction: IProcessedTransaction,
    output: Output,
    account: IAccountState
): SenderInfo {
    const { direction, wrappedInputs } = processedTransaction

    const recipient = getRecipientFromOutput(output)
    const sender = wrappedInputs?.length
        ? getSubjectFromAddress(getSenderAddressFromInputs(wrappedInputs))
        : getSenderFromTransaction(direction === ActivityDirection.Incoming, account.depositAddress, output)

    const subject = direction === ActivityDirection.Incoming ? sender : recipient
    const isInternal = isSubjectInternal(subject)

    return {
        subject,
        isInternal,
    }
}
