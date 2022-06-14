import { BASE_TOKEN } from '@core/network'
import { activeProfile } from '@core/profile'
import { OutputData, Transaction } from '@iota/wallet'
import { Bech32Helper } from '@lib/bech32Helper'
import { Converter } from '@lib/converter'
import { convertToFiat, formatCurrency } from '@lib/currency'
import { findAccountWithAddress } from '@lib/wallet'
import { get } from 'svelte/store'
import { ActivityAsyncStatus, ActivityDirection, ActivityType, InclusionState } from '../enums'
import { IActivity } from '../interfaces'
import { ITokenMetadata } from '../interfaces/token-metadata.interface'
import { Recipient } from '../types'
import { formatTokenAmountBestMatch, isAsyncUnlockCondition } from '../utils'
import { MILLISECONDS_PER_SECOND } from 'shared/lib/time'
import { ADDRESS_TYPE_ED25519, OUTPUT_TYPE_TREASURY, UNLOCK_CONDITION_EXPIRATION } from '../constants'

export class Activity implements IActivity {
    id: string
    outputId?: string
    transactionId?: string
    time: Date
    type: ActivityType
    direction: ActivityDirection
    inclusionState: InclusionState
    isInternal: boolean
    rawAmount: number
    recipient: Recipient
    token: ITokenMetadata
    isAsync: boolean
    expirationDate?: Date
    isHidden?: boolean
    isClaimed?: boolean

    setFromTransaction(transactionId: string, transaction: Transaction): Activity {
        this.id = transactionId
        this.transactionId = transactionId
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

    setNewTransaction(transactionId: string, amount: number, address: string): Activity {
        const account = findAccountWithAddress(address)
        const isInternal = !!account

        this.id = transactionId
        this.transactionId = transactionId
        this.time = new Date()
        this.type = getActivityType(false, isInternal)
        this.direction = ActivityDirection.Out
        this.inclusionState = InclusionState.Pending
        this.isInternal = isInternal
        this.rawAmount = amount
        this.recipient = isInternal ? { type: 'account', account: account } : { type: 'address', address: address }
        this.token = BASE_TOKEN[get(activeProfile).networkProtocol]
        this.isAsync = false
        this.isHidden = false
        return this
    }

    setFromOutput({
        output,
        accountAddress,
        hidden,
        claimed,
    }: {
        output: OutputData
        accountAddress: string
        hidden: boolean
        claimed: boolean
    }): Activity {
        const address =
            output?.address?.type === ADDRESS_TYPE_ED25519
                ? Bech32Helper.toBech32(0, Converter.hexToBytes(output.address.pubKeyHash.substring(2)), 'rms')
                : ''
        const isIncoming = address === accountAddress
        // const isInternal = !!findAccountWithAddress(address)
        const isInternal = false
        this.id = output.outputId
        this.outputId = output.outputId
        this.time = new Date(output.metadata.milestoneTimestampBooked * MILLISECONDS_PER_SECOND)
        this.type = getActivityType(isIncoming, isInternal)
        this.direction = isIncoming ? ActivityDirection.In : ActivityDirection.Out
        this.inclusionState = InclusionState.Confirmed
        this.isInternal = isInternal
        this.rawAmount = Number(output.amount)
        this.token = BASE_TOKEN[get(activeProfile).networkProtocol]

        if (output.output.type !== OUTPUT_TYPE_TREASURY) {
            for (const unlockCondition of output.output.unlockConditions) {
                if (isAsyncUnlockCondition(unlockCondition)) {
                    this.isAsync = true
                    this.isHidden = hidden
                    this.expirationDate =
                        unlockCondition.type === UNLOCK_CONDITION_EXPIRATION ? new Date(unlockCondition.unixTime) : null
                    this.isClaimed = claimed
                    break
                }
            }
        }
        return this
    }

    getAsyncStatus(time: Date): ActivityAsyncStatus {
        if (this.isAsync) {
            if (this.isClaimed) {
                return ActivityAsyncStatus.Claimed
            } else {
                if (time > this.expirationDate) {
                    return ActivityAsyncStatus.Expired
                } else {
                    return ActivityAsyncStatus.Unclaimed
                }
            }
        }
        return null
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
