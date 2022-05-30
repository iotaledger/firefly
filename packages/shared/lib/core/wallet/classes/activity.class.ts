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
    private _id: string
    private _time: Date
    private _type: ActivityType
    private _direction: ActivityDirection
    private _inclusionState: InclusionState
    private _isInternal: boolean
    private _rawAmount: number
    private _recipient: Recipient
    private _token: ITokenMetadata
    private _isAsync: boolean
    private _expireDate?: Date
    private _isHidden?: boolean
    private _isClaimed?: boolean

    get id(): string {
        return this._id
    }

    get time(): Date {
        return this._time
    }

    get inclusionState(): InclusionState {
        return this._inclusionState
    }

    get isAsync(): boolean {
        return this._isAsync
    }

    get isInternal(): boolean {
        return this._isInternal
    }

    get rawAmount(): number {
        return this._rawAmount
    }

    get isClaimed(): boolean {
        return this._isClaimed
    }

    get recipient(): Recipient {
        return this._recipient
    }

    get expireDate(): Date {
        return this._expireDate
    }

    get token(): ITokenMetadata {
        return this._token
    }

    get type(): ActivityType {
        return this._type
    }

    get direction(): ActivityDirection {
        return this._direction
    }

    setFromTransaction(transactionId: string, transaction: Transaction): Activity {
        this._id = transactionId
        this._time = new Date(Number(transaction.timestamp))
        this._type = ActivityType.Send
        this._direction = transaction.incoming ? ActivityDirection.In : ActivityDirection.Out
        this._inclusionState = transaction.inclusionState
        this._isInternal = false
        this._rawAmount = 0
        this._recipient = { type: 'address', address: 'Address unknown' }
        this._token = BASE_TOKEN[get(activeProfile).networkProtocol]
        this._isAsync = false
        this._isHidden = false
        return this
    }

    getAsyncStatus(time: Date): ActivityAsyncStatus {
        if (this._isAsync) {
            if (this._isClaimed) {
                return ActivityAsyncStatus.Claimed
            } else {
                if (time > this._expireDate) {
                    return ActivityAsyncStatus.Expired
                } else {
                    return ActivityAsyncStatus.Unclaimed
                }
            }
        }
        return
    }

    getFormattedAmount(signed: boolean): string {
        return `${this._type !== ActivityType.Receive && signed ? '- ' : ''}${formatTokenAmountBestMatch(
            this._rawAmount,
            this._token,
            2
        )}`
    }

    getFiatAmount(fiatPrice?: number, exchangeRate?: number): string {
        if (fiatPrice && exchangeRate) {
            const fiatValue = formatCurrency(convertToFiat(this._rawAmount, fiatPrice, exchangeRate))
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
