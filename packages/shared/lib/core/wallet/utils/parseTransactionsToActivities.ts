import { truncateString } from '@lib/helpers'
import { ActivityAsyncStatus, ActivityDirection, ActivityType, IActivity } from '@core/wallet'
import { AccountMessage } from '@lib/typings/wallet'
import { formatUnitBestMatch } from '@lib/units'
import {
    findAccountWithAddress,
    findAccountWithAnyAddress,
    getIncomingFlag,
    getInternalFlag,
    receiverAddressesFromTransactionPayload,
    sendAddressFromTransactionPayload,
} from '@lib/wallet'
import { formatTokenAmountBestMatch } from './formatTokenAmountBestMatch'

export function parseTransactionsToActivities(transactions: AccountMessage[]): IActivity[] {
    return transactions.map((transaction) => ({
        id: transaction.id,
        type: 'Transaction',
        timestamp: transaction.timestamp,
        activityType: getActivityType(transaction.payload),
        internal: getInternalFlag(transaction.payload),
        direction: getIncomingFlag(transaction.payload) ? ActivityDirection.In : ActivityDirection.Out,
        confirmed: transaction.confirmed,
        subjectAccountName: getSubjectName(transaction.payload),
        subjectAddress: getSubjectAddress(transaction.payload),
        amount: getMessageValue(transaction.payload),
        fiatAmount: '-',
        token: {
            name: 'Iota',
            unit: 'i',
            useMetricPrefix: true,
        },
    }))
}

function getMessageValue(payload) {
    const token = {
        name: 'Iota',
        unit: 'i',
        useMetricPrefix: true,
    }
    return `${!getIncomingFlag(payload) ? '-' : ''}${formatTokenAmountBestMatch(
        payload.data.essence.data.value,
        token,
        2
    )}`
}

function getActivityType(payload) {
    if (getInternalFlag(payload)) {
        return ActivityType.Transfer
    } else if (getIncomingFlag(payload)) {
        return ActivityType.Receive
    } else {
        return ActivityType.Send
    }
}

function getSubjectName(payload) {
    const senderAddress = sendAddressFromTransactionPayload(payload)

    // There can only be one sender address
    const senderAccount = findAccountWithAddress(senderAddress)

    if (getIncomingFlag(payload)) {
        return senderAccount?.name
    } else {
        const receiverAddresses = receiverAddressesFromTransactionPayload(payload)

        // For an incoming transaction there might be multiple receiver addresses
        // especially if there was a remainder, so if any account addresses match
        // we need to find the account details for our address match
        const receiverAccount = getInternalFlag(payload)
            ? findAccountWithAnyAddress(receiverAddresses, senderAccount)
            : null
        return receiverAccount?.name
    }
}

function getSubjectAddress(payload) {
    return getIncomingFlag(payload)
        ? sendAddressFromTransactionPayload(payload)
        : receiverAddressesFromTransactionPayload(payload)[0]
}
