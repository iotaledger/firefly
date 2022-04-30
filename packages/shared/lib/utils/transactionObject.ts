import { Payload } from '@lib/typings/message'
import {
    findAccountWithAddress,
    findAccountWithAnyAddress,
    getIncomingFlag,
    getInternalFlag,
    receiverAddressesFromTransactionPayload,
    sendAddressFromTransactionPayload,
} from '@lib/wallet'

export function getTransactionSubjectAddressOrAccount(transactionPayload: Payload): {
    isSubjectAccount: boolean
    subject: string
} {
    let response: { isSubjectAccount: boolean; subject: string }

    const incoming = getIncomingFlag(transactionPayload)
    const internal = getInternalFlag(transactionPayload)

    const senderAddress = sendAddressFromTransactionPayload(transactionPayload)
    const senderAccount = findAccountWithAddress(senderAddress)

    const receiverAddresses = receiverAddressesFromTransactionPayload(transactionPayload)
    const receiverAccount = incoming || internal ? findAccountWithAnyAddress(receiverAddresses, senderAccount) : null

    const account = incoming ? senderAccount : receiverAccount

    if (account) {
        response = { isSubjectAccount: true, subject: account.alias }
    } else {
        // We can't find the address in our accounts so just display the abbreviated address
        response = { isSubjectAccount: false, subject: incoming ? receiverAddresses[0] : senderAddress }
    }

    return response
}
