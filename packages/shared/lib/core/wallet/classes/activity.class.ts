import { ITransactionPayload } from '@iota/types'
import { Transaction } from '@iota/wallet'
import { convertToFiat, formatCurrency } from '@lib/currency'
import { AccountMessage } from '@lib/typings/wallet'
import {
    findAccountWithAddress,
    findAccountWithAnyAddress,
    getIncomingFlag,
    getInternalFlag,
} from '@lib/wallet'
import { ActivityAsyncStatus, ActivityDirection, ActivityType, InclusionState } from '../enums'
import { IActivity } from '../interfaces'
import { ITokenMetadata } from '../interfaces/token-metadata.interface'
import { Recipient } from '../types'
import { formatTokenAmountBestMatch, receiverAddressesFromTransactionPayload, sendAddressFromTransactionPayload } from '../utils'

export class Activity implements IActivity {
    id: string
    type: string
    time: Date
    activityType: ActivityType
    direction: ActivityDirection
    inclusionState: InclusionState
    internal: boolean
    rawAmount: number
    recipient: Recipient
    token: ITokenMetadata
    conversion?: number
    isAsync: boolean
    expireDate?: Date
    hidden?: boolean
    isClaimed?: boolean

    constructor() {}

    setFromAccountMessage(message: AccountMessage): Activity {
        this.id = message.id
        this.type = 'Transaction'
        this.time = new Date(Number(message.timestamp))
        this.activityType = getActivityType(message.payload)
        this.internal = getInternalFlag(message.payload)
        this.direction = getIncomingFlag(message.payload) ? ActivityDirection.In : ActivityDirection.Out
        this.inclusionState = message.confirmed ? InclusionState.Confirmed : InclusionState.Pending
        this.recipient = getRecipient(message.payload)
        this.rawAmount = message.payload.type === 'Transaction' ? Number(message.payload.data.essence.data.value) : 0
        this.isAsync = true
        this.expireDate = new Date(2022, 5, 25, 12)
        this.hidden = false
        this.isClaimed = false
        this.token = {
            name: 'Iota',
            unit: 'i',
            useMetricPrefix: true,
        }
        return this
    }

    setFromTransaction(transaction: Transaction): Activity {
        this.id = transaction.blockId
        this.type = 'Transaction'
        this.time = new Date(Number(transaction.timestamp))
        this.internal = false
        this.direction = transaction.incoming ? ActivityDirection.In : ActivityDirection.Out
        this.inclusionState = transaction.inclusionState
        this.recipient = getRecipient(transaction.payload, transaction.incoming, false)

        return this
    }

    getAsyncStatus(time: Date): ActivityAsyncStatus {
        if (this.isAsync) {
            if (this.isClaimed) {
                return ActivityAsyncStatus.Claimed
            } else {
                if (time > this.expireDate) {
                    return ActivityAsyncStatus.Expired
                } else {
                    return ActivityAsyncStatus.Unclaimed
                }
            }
        }
        return undefined
    }

    getFormattedAmount(signum: boolean): string {
        return `${this.activityType !== ActivityType.Receive && signum ? '-' : ''}${formatTokenAmountBestMatch(
            this.rawAmount,
            this.token,
            2
        )}`
    }

    getFiatAmount(fiatPrice: number, exchangeRate: number): string {
        const fiatValue = formatCurrency(convertToFiat(this.rawAmount, fiatPrice, exchangeRate))
        return fiatValue ? fiatValue : '-'
    }
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

function getRecipient(payload: ITransactionPayload, incoming: boolean, internal: boolean): Recipient {
    const senderAddress = sendAddressFromTransactionPayload(payload)

    // There can only be one sender address
    const senderAccount = findAccountWithAddress(senderAddress)

    if (incoming) {
        return senderAccount
            ? { type: 'account', account: senderAccount }
            : { type: 'address', address: sendAddressFromTransactionPayload(payload) }
    } else {
        const receiverAddresses = receiverAddressesFromTransactionPayload(payload)

        // For an incoming transaction there might be multiple receiver addresses
        // especially if there was a remainder, so if any account addresses match
        // we need to find the account details for our address match
        const receiverAccount = internal
            ? findAccountWithAnyAddress(receiverAddresses, senderAccount)
            : null

        return receiverAccount
            ? { type: 'account', account: receiverAccount }
            : { type: 'address', address: receiverAddressesFromTransactionPayload(payload)[0] }
    }
}
