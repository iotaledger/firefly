import { selectedAccount } from '@core/account'
import { BASE_TOKEN } from '@core/network'
import { activeAccounts, activeProfile } from '@core/profile'
import { ITransactionPayload } from '@iota/types'
import { OutputData, Transaction } from '@iota/wallet'
import { convertToFiat, formatCurrency } from '@lib/currency'
import { convertBech32AddressToEd25519Address } from '@lib/ed25519'
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

    setFromOutput(outputId: string, output: OutputData, accountAddress: string): Activity {
        const address = output.address.type === 0 ? output.address.pubKeyHash.substring(2) : 'Address unknown'
        const isIncoming = address === accountAddress
        const isInternal = !!get(activeAccounts).find(
            (acc) => convertBech32AddressToEd25519Address(acc.meta.publicAddresses[0].address) === address
        )
        this.id = outputId
        this.time = new Date()
        this.type = getActivityType(isIncoming, isInternal)
        this.direction = isIncoming ? ActivityDirection.In : ActivityDirection.Out
        this.inclusionState = InclusionState.Confirmed
        this.isInternal = isInternal
        this.rawAmount = Number(output.amount)
        ;(this.recipient = getRecipient2(address, isIncoming)),
            (this.token = BASE_TOKEN[get(activeProfile).networkProtocol])
        this.isAsync = true
        this.expireDate = new Date(2023, 1, 1)
        this.isHidden = false
        this.isClaimed = false
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
        return `${this.direction !== ActivityDirection.In && signed ? '- ' : ''}${formatTokenAmountBestMatch(
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

function getActivityType(incoming: boolean, internal: boolean): ActivityType {
    if (internal) {
        return ActivityType.Transfer
    } else if (incoming) {
        return ActivityType.Receive
    } else {
        return ActivityType.Send
    }
}

function getRecipient2(address: string, isIncoming: boolean): Recipient {
    // TODO: change this code when we have the output addresses as bech32
    // const account = findAccountWithAddress(address)
    const account = get(activeAccounts).find(
        (acc) => convertBech32AddressToEd25519Address(acc.meta.publicAddresses[0].address) === address
    )

    return account ? { type: 'account', account: account } : { type: 'address', address: address }
}
