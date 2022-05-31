import { BASE_TOKEN } from '@core/network'
import { activeProfile } from '@core/profile'
import { ITransactionPayload } from '@iota/types'
import { Transaction } from '@iota/wallet'
import { convertToFiat, formatCurrency } from '@lib/currency'
import { findAccountWithAddress, findAccountWithAnyAddress, getIncomingFlag, getInternalFlag } from '@lib/wallet'
import { get } from 'svelte/store'
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
    time: Date
    type: ActivityType
    direction: ActivityDirection
    inclusionState: InclusionState
    isInternal: boolean
    rawAmount: number
    recipient: Recipient
    token: ITokenMetadata
    isAsync: boolean
    expireDate?: Date
    isHidden?: boolean
    isClaimed?: boolean

    setFromTransaction(transactionId: string, transaction: Transaction): Activity {
        this.id = transactionId
        this.time = new Date(Number(transaction.timestamp))
        this.type = ActivityType.Send
        this.direction = transaction.incoming ? ActivityDirection.In : ActivityDirection.Out
        this.inclusionState = transaction.inclusionState
        this.isInternal = false
        this.rawAmount = 0
        this.recipient = { type: 'address', address: 'Address unknown' }
        this.token = BASE_TOKEN[get(activeProfile).networkProtocol]
        this.isAsync = false
        this.isHidden = false
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
        return
    }

    getFormattedAmount(signed: boolean): string {
        return `${this.type !== ActivityType.Receive && signed ? '- ' : ''}${formatTokenAmountBestMatch(
            this.rawAmount,
            this.token,
            2
        )}`
    }

    getFiatAmount(fiatPrice?: number, exchangeRate?: number): string {
        if (fiatPrice && exchangeRate) {
            const fiatValue = formatCurrency(convertToFiat(this.rawAmount, fiatPrice, exchangeRate))
            return fiatValue ? fiatValue : '-'
        } else {
            return '-'
        }
    }
}

// TODO: move this back once we know how to get the type
// function getActivityType(payload) {
//     if (getInternalFlag(payload)) {
//         return ActivityType.Transfer
//     } else if (getIncomingFlag(payload)) {
//         return ActivityType.Receive
//     } else {
//         return ActivityType.Send
//     }
// }

// TODO: idem as above
// function getRecipient(payload: ITransactionPayload, incoming: boolean, internal: boolean): Recipient {
//     const senderAddress = sendAddressFromTransactionPayload(payload)

//     // There can only be one sender address
//     const senderAccount = findAccountWithAddress(senderAddress)

//     if (incoming) {
//         return senderAccount
//             ? { type: 'account', account: senderAccount }
//             : { type: 'address', address: sendAddressFromTransactionPayload(payload) }
//     } else {
//         const receiverAddresses = receiverAddressesFromTransactionPayload(payload)

//         // For an incoming transaction there might be multiple receiver addresses
//         // especially if there was a remainder, so if any account addresses match
//         // we need to find the account details for our address match
//         const receiverAccount = internal ? findAccountWithAnyAddress(receiverAddresses, senderAccount) : null

//         return receiverAccount
//             ? { type: 'account', account: receiverAccount }
//             : { type: 'address', address: receiverAddressesFromTransactionPayload(payload)[0] }
//     }
// }
