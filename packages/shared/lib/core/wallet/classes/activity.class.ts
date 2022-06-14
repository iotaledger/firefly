import { BASE_TOKEN } from '@core/network'
import { activeProfile } from '@core/profile'
import { OutputData, OutputOptions, Transaction } from '@iota/wallet'
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
import {
    ADDRESS_TYPE_ED25519,
    FEATURE_TYPE_METADATA,
    FEATURE_TYPE_TAG,
    OUTPUT_TYPE_BASIC,
    OUTPUT_TYPE_TREASURY,
    UNLOCK_CONDITION_ADDRESS,
    UNLOCK_CONDITION_EXPIRATION,
    UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN,
} from '../constants'
import type { IMetadataFeature, ITagFeature, OutputTypes } from '@iota/types'

export class Activity implements IActivity {
    type: ActivityType
    id: string
    isHidden?: boolean

    transactionId?: string
    inclusionState: InclusionState
    time: Date

    recipient: Recipient
    isInternal: boolean
    direction: ActivityDirection

    outputId?: string
    rawAmount: number
    token: ITokenMetadata
    metadata?: string
    tag?: string

    storageDeposit?: number
    expirationDate?: Date
    isAsync: boolean
    isClaimed?: boolean

    setNewTransaction(transactionId: string, outputOptions: OutputOptions, output: OutputTypes): Activity {
        const account = findAccountWithAddress(outputOptions.recipientAddress)
        const isInternal = !!account

        this.type = getActivityType(false, isInternal)
        this.id = transactionId
        this.isHidden = false

        this.transactionId = transactionId
        this.inclusionState = InclusionState.Pending
        this.time = new Date()

        this.recipient = isInternal
            ? { type: 'account', account: account }
            : { type: 'address', address: outputOptions.recipientAddress }
        this.isInternal = isInternal
        this.direction = ActivityDirection.Out

        this.rawAmount = Number(outputOptions.amount)
        this.token = BASE_TOKEN[get(activeProfile).networkProtocol]
        this.metadata = outputOptions?.features.metadata
        this.tag = outputOptions?.features.tag

        this.storageDeposit = Number(output.amount) - Number(outputOptions.amount)
        this.expirationDate = new Date(outputOptions?.unlocks?.expiration?.unixTime * MILLISECONDS_PER_SECOND)
        this.isAsync =
            outputOptions?.storageDeposit > 0 ||
            !!(outputOptions?.unlocks?.expiration?.milestoneIndex || outputOptions?.unlocks?.expiration?.unixTime)
        this.isClaimed = false

        return this
    }

    setFromTransaction(transactionId: string, transaction: Transaction, accountAddress: string): Activity {
        const output: OutputTypes = getNonRemainderOutputFromTransaction(
            transaction,
            accountAddress,
            transaction.incoming
        )

        this.type = ActivityType.Send // TODO
        this.id = ''
        this.isHidden = false // TODO

        this.transactionId = transactionId
        this.inclusionState = transaction.inclusionState
        this.time = new Date(Number(transaction.timestamp))

        this.recipient = { type: 'address', address: 'Address unknown' } // TODO
        this.isInternal = false
        this.direction = transaction.incoming ? ActivityDirection.In : ActivityDirection.Out

        this.rawAmount = getAmountFromOutput(output)
        this.token = BASE_TOKEN[get(activeProfile).networkProtocol]
        this.metadata = getMetadataFromOutput(output)
        this.tag = getTagFromOutput(output)

        this.storageDeposit = 0
        this.expirationDate = undefined // TODO
        this.isAsync = false
        this.isClaimed = false

        return this
    }

    setFromOutputData({
        outputData,
        accountAddress,
        hidden,
    }: {
        outputData: OutputData
        accountAddress: string
        hidden: boolean
    }): Activity {
        const address =
            outputData?.address?.type === ADDRESS_TYPE_ED25519
                ? Bech32Helper.toBech32(0, Converter.hexToBytes(outputData.address.pubKeyHash.substring(2)), 'rms')
                : ''
        const isIncoming = address === accountAddress
        // const isInternal = !!findAccountWithAddress(address)
        const isInternal = false

        this.type = getActivityType(isIncoming, isInternal)
        this.id = outputData.outputId
        this.isHidden = hidden // TODO

        this.transactionId = outputData?.metadata?.transactionId
        this.inclusionState = InclusionState.Confirmed
        this.time = new Date(outputData.metadata.milestoneTimestampBooked)

        if (!isIncoming) {
            this.recipient = { type: 'address', address }
        }
        this.isInternal = isInternal
        this.direction = isIncoming ? ActivityDirection.In : ActivityDirection.Out

        this.outputId = outputData.outputId
        this.rawAmount = getAmountFromOutput(outputData.output)
        this.token = BASE_TOKEN[get(activeProfile).networkProtocol]

        if (outputData.output.type !== OUTPUT_TYPE_TREASURY) {
            for (const unlockCondition of outputData.output.unlockConditions) {
                if (isAsyncUnlockCondition(unlockCondition)) {
                    this.isAsync = true
                    this.isClaimed = false // TODO
                }
                if (unlockCondition.type === UNLOCK_CONDITION_EXPIRATION) {
                    this.expirationDate = new Date(unlockCondition.unixTime * MILLISECONDS_PER_SECOND)
                }
                if (unlockCondition.type === UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN) {
                    this.storageDeposit = Number(unlockCondition.amount)
                    if (isIncoming) {
                        this.recipient = {
                            type: 'address',
                            ...(unlockCondition.returnAddress.type === ADDRESS_TYPE_ED25519 && {
                                address: Bech32Helper.toBech32(
                                    0,
                                    Converter.hexToBytes(unlockCondition.returnAddress.pubKeyHash.substring(2)),
                                    'rms'
                                ),
                            }),
                        }
                    }
                }
                return this
            }
        }
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

function getNonRemainderOutputFromTransaction(
    transaction: Transaction,
    accountAddress: string,
    isIncoming: boolean
): OutputTypes {
    const outputs = transaction.payload.essence.outputs
    const nonRemainerOutputs = outputs.filter((output) => {
        let recipientAddress = ''
        if (
            output.type === OUTPUT_TYPE_BASIC &&
            output.unlockConditions[0].type === UNLOCK_CONDITION_ADDRESS &&
            output.unlockConditions[0].address.type === ADDRESS_TYPE_ED25519
        ) {
            recipientAddress = Bech32Helper.toBech32(
                0,
                Converter.hexToBytes(output.unlockConditions[0].address.pubKeyHash.substring(2)),
                'rms'
            )
        }

        if (isIncoming) {
            return accountAddress === recipientAddress
        } else {
            return accountAddress !== recipientAddress
        }
    })
    return nonRemainerOutputs[0]
}

function getAmountFromOutput(output: OutputTypes): number {
    return Number(output?.amount ?? 0)
}

function getMetadataFromOutput(output: OutputTypes): string {
    if (output.type !== OUTPUT_TYPE_TREASURY) {
        const metadataFeature: IMetadataFeature = <IMetadataFeature>(
            output?.features?.find((feature) => feature.type === FEATURE_TYPE_METADATA)
        )
        return metadataFeature?.data
    }
    return undefined
}

function getTagFromOutput(output: OutputTypes): string {
    if (output.type !== OUTPUT_TYPE_TREASURY) {
        const tagFeature = <ITagFeature>output?.features?.find((feature) => feature.type === FEATURE_TYPE_TAG)
        return tagFeature?.tag
    }
    return undefined
}
