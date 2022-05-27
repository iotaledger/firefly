import { ITransactionPayload } from '@iota/types'
import { Transaction } from '@iota/wallet'
import { convertToFiat, formatCurrency } from '@lib/currency'
import { address } from '@lib/typings'
import { AccountMessage } from '@lib/typings/wallet'
import { findAccountWithAddress, findAccountWithAnyAddress, getIncomingFlag, getInternalFlag } from '@lib/wallet'
import { ActivityAsyncStatus, ActivityDirection, ActivityType, InclusionState } from '../enums'
import { IActivity } from '../interfaces'
import { ITokenMetadata } from '../interfaces/token-metadata.interface'
import { Recipient } from '../types'
import {
    formatTokenAmountBestMatch,
    receiverAddressesFromTransactionPayload,
    sendAddressFromTransactionPayload,
} from '../utils'

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

    setFromTransaction(transaction: Transaction): Activity {
        this.id = transaction.blockId
        this.type = 'Transaction'
        this.time = new Date(Number(transaction.timestamp))
        this.internal = false
        this.direction = transaction.incoming ? ActivityDirection.In : ActivityDirection.Out
        this.inclusionState = transaction.inclusionState
        this.recipient = { type: 'address', address: 'Address unknown' }
        this.isAsync = false
        this.rawAmount = 0
        this.hidden = false
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
        const receiverAccount = internal ? findAccountWithAnyAddress(receiverAddresses, senderAccount) : null

        return receiverAccount
            ? { type: 'account', account: receiverAccount }
            : { type: 'address', address: receiverAddressesFromTransactionPayload(payload)[0] }
    }
}
