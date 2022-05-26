import { ActivityType, ActivityDirection, ActivityAsyncStatus } from '../enums'
import { ITokenMetadata } from './token-metadata.interface'
import {
    findAccountWithAddress,
    findAccountWithAnyAddress,
    getIncomingFlag,
    getInternalFlag,
    receiverAddressesFromTransactionPayload,
    sendAddressFromTransactionPayload,
} from '@lib/wallet'
import { AccountMessage } from '@lib/typings/wallet'
import { formatTokenAmountBestMatch } from '../utils'
import { Recipient } from '../types'

export class Activity {
    id: string
    type: string
    time: Date
    activityType: ActivityType
    direction: ActivityDirection
    confirmed: boolean
    internal: boolean
    rawAmount: number
    recipient: Recipient
    token: ITokenMetadata
    conversion?: number
    isAsync: boolean
    expireDate?: Date
    hidden?: boolean
    isClaimed?: boolean

    constructor(message: AccountMessage) {
        this.id = message.id
        this.type = 'Transaction'
        ;(this.time = new Date(Number(message.timestamp))), (this.activityType = getActivityType(message.payload))
        this.internal = getInternalFlag(message.payload)
        this.direction = getIncomingFlag(message.payload) ? ActivityDirection.In : ActivityDirection.Out
        this.confirmed = message.confirmed
        this.recipient = getRecipient(message.payload)
        this.rawAmount = Number(message.payload.data.essence.data.value)
        this.isAsync = true
        this.expireDate = new Date(2022, 5, 25, 12)
        this.hidden = false
        this.isClaimed = false
        this.token = {
            name: 'Iota',
            unit: 'i',
            useMetricPrefix: true,
        }
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

    getFormattedAmount(): string {
        return `${!(this.activityType === ActivityType.Receive) ? '-' : ''}${formatTokenAmountBestMatch(
            this.rawAmount,
            this.token,
            2
        )}`
    }

    getFiatAmount(): string {
        return '-'
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

function getRecipient(payload): Recipient {
    const senderAddress = sendAddressFromTransactionPayload(payload)

    // There can only be one sender address
    const senderAccount = findAccountWithAddress(senderAddress)

    if (getIncomingFlag(payload)) {
        return senderAccount
            ? { type: 'account', account: senderAccount }
            : { type: 'address', address: sendAddressFromTransactionPayload(payload) }
    } else {
        const receiverAddresses = receiverAddressesFromTransactionPayload(payload)

        // For an incoming transaction there might be multiple receiver addresses
        // especially if there was a remainder, so if any account addresses match
        // we need to find the account details for our address match
        const receiverAccount = getInternalFlag(payload)
            ? findAccountWithAnyAddress(receiverAddresses, senderAccount)
            : null

        return receiverAccount
            ? { type: 'account', account: receiverAccount }
            : { type: 'address', address: receiverAddressesFromTransactionPayload(payload)[0] }
    }
}
