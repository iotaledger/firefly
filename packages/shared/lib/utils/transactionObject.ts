import { IAccountState } from '@core/account'
import { Payload } from '@lib/typings/message'
import {
    findAccountWithAddress,
    findAccountWithAnyAddress,
    getIncomingFlag,
    getInternalFlag,
    receiverAddressesFromTransactionPayload,
    sendAddressFromTransactionPayload,
} from '@lib/wallet'

export function getTransactionSubjectAddressOrAccount(
    transactionPayload: Payload
): { isSubjectAccount: true; subject: IAccountState } | { isSubjectAccount: false; subject: string } {
    const incoming = getIncomingFlag(transactionPayload)
    const internal = getInternalFlag(transactionPayload)

    const senderAddress = sendAddressFromTransactionPayload(transactionPayload)
    const senderAccount = findAccountWithAddress(senderAddress)

    const receiverAddresses = receiverAddressesFromTransactionPayload(transactionPayload)
    const receiverAccount = incoming || internal ? findAccountWithAnyAddress(receiverAddresses, senderAccount) : null

    const account = incoming ? senderAccount : receiverAccount

    if (account) {
        return { isSubjectAccount: true, subject: account }
    } else {
        // We can't find the address in our accounts so just display the abbreviated address
        return { isSubjectAccount: false, subject: incoming ? receiverAddresses[0] : senderAddress }
    }
}
