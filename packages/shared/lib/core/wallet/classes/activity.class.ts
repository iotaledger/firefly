import { BASE_TOKEN } from '@core/network'
import { activeProfile } from '@core/profile'
import { OutputData, OutputOptions, Transaction } from '@iota/wallet'
import { convertToFiat, formatCurrency } from '@lib/currency'
import { findAccountWithAddress } from '@lib/wallet'
import { get } from 'svelte/store'
import { ActivityAsyncStatus, ActivityDirection, ActivityType, InclusionState } from '../enums'
import { IActivity } from '../interfaces'
import { ITokenMetadata } from '../interfaces/token-metadata.interface'
import { Recipient, Sender } from '../types'
import {
    formatTokenAmountBestMatch,
    getRecipientAddressFromOutput,
    getSenderAddressFromUnlockCondition,
} from '../utils'
import { MILLISECONDS_PER_SECOND } from 'shared/lib/time'
import {
    FEATURE_TYPE_METADATA,
    FEATURE_TYPE_TAG,
    OUTPUT_TYPE_TREASURY,
    UNLOCK_CONDITION_EXPIRATION,
    UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN,
} from '../constants'
import { IMetadataFeature, ITagFeature, IUTXOInput, OutputTypes } from '@iota/types'
import { IAccountState } from '@core/account'

export class Activity implements IActivity {
    type: ActivityType
    id: string
    isHidden?: boolean

    transactionId?: string
    inclusionState: InclusionState
    time: Date

    sender: Sender
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

    setNewTransaction(
        senderAccount: IAccountState,
        transactionId: string,
        outputOptions: OutputOptions,
        output: OutputTypes
    ): Activity {
        const account = findAccountWithAddress(outputOptions.recipientAddress)
        const isInternal = !!account

        this.type = getActivityType(false, isInternal)
        this.id = transactionId
        this.isHidden = false

        this.transactionId = transactionId
        this.inclusionState = InclusionState.Pending
        this.time = new Date()

        this.sender = { type: 'account', account: senderAccount }
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
        const output: OutputTypes = getNonRemainderOutputFromTransaction(transaction, accountAddress)
        const recipient = getRecipientFromOutput(output)

        this.type = getActivityType(transaction.incoming, false)
        this.id = ''
        this.isHidden = false // TODO

        this.transactionId = transactionId
        this.inclusionState = transaction.inclusionState
        this.time = new Date(Number(transaction.timestamp))

        this.sender = getSenderFromTransaction(transaction, accountAddress)
        this.recipient = recipient
        this.isInternal = isRecipientInternal(recipient)
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
        const recipientAddress = getRecipientAddressFromOutput(outputData.output)
        const recipient = getRecipientFromOutput(outputData.output)
        const isIncoming = recipientAddress === accountAddress
        // const isInternal = !!findAccountWithAddress(address)
        const isInternal = isRecipientInternal(recipient)

        this.type = getActivityType(isIncoming, isInternal)
        this.id = outputData.outputId
        this.isHidden = hidden // TODO

        this.transactionId = outputData?.metadata?.transactionId
        this.inclusionState = InclusionState.Confirmed
        this.time = new Date(outputData.metadata.milestoneTimestampBooked)

        this.sender = getSenderFromOutput(outputData.output)
        this.recipient = recipient
        this.isInternal = isInternal
        this.direction = isIncoming ? ActivityDirection.In : ActivityDirection.Out

        this.outputId = outputData.outputId
        this.rawAmount = getAmountFromOutput(outputData.output)
        this.token = BASE_TOKEN[get(activeProfile).networkProtocol]

        setAsyncDataForOutput(this, outputData.output, isIncoming)
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

function getActivityType(incoming: boolean, internal: boolean): ActivityType {
    if (internal) {
        return ActivityType.Transfer
    } else if (incoming) {
        return ActivityType.Receive
    } else {
        return ActivityType.Send
    }
}

function getNonRemainderOutputFromTransaction(transaction: Transaction, accountAddress: string): OutputTypes {
    const outputs = transaction.payload.essence.outputs
    const nonRemainerOutputs = outputs.filter((output) => {
        const recipientAddress = getRecipientAddressFromOutput(output)

        if (transaction.incoming) {
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
    // TODO get the parsed data
    if (output.type !== OUTPUT_TYPE_TREASURY) {
        const metadataFeature: IMetadataFeature = <IMetadataFeature>(
            output?.features?.find((feature) => feature.type === FEATURE_TYPE_METADATA)
        )
        return metadataFeature?.data
    }
    return undefined
}

function getTagFromOutput(output: OutputTypes): string {
    // TODO get the parsed data
    if (output.type !== OUTPUT_TYPE_TREASURY) {
        const tagFeature = <ITagFeature>output?.features?.find((feature) => feature.type === FEATURE_TYPE_TAG)
        return tagFeature?.tag
    }
    return undefined
}

function getRecipientFromOutput(output: OutputTypes): Recipient {
    const recipientAddress = getRecipientAddressFromOutput(output)
    const recipientAccount = findAccountWithAddress(recipientAddress)
    if (recipientAccount) {
        return { type: 'account', account: recipientAccount }
    } else {
        return { type: 'address', address: recipientAddress }
    }
}

function isRecipientInternal(recipient): boolean {
    return recipient.type === 'account'
}

function setAsyncDataForOutput(activity: Activity, output: OutputTypes, isIncoming: boolean): void {
    if (output.type !== OUTPUT_TYPE_TREASURY) {
        for (const unlockCondition of output.unlockConditions) {
            if (unlockCondition.type === UNLOCK_CONDITION_EXPIRATION) {
                activity.isAsync = true
                activity.isClaimed = false // TODO
                activity.expirationDate = new Date(unlockCondition.unixTime * MILLISECONDS_PER_SECOND)
            }
            if (unlockCondition.type === UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN) {
                activity.isAsync = true
                activity.isClaimed = false // TODO
                activity.storageDeposit = Number(unlockCondition.amount)
            }
        }
    }
}

function getSenderFromTransaction(transaction: Transaction, accountAddress): Sender {
    if (!transaction?.incoming) {
        return { type: 'address', address: accountAddress }
    } else if (transaction?.incoming) {
        getSenderFromTransactionInputs(transaction.payload.essence.inputs) ??
            getSenderFromOutput(getNonRemainderOutputFromTransaction(transaction, accountAddress))
    } else {
        return undefined
    }
}

function getSenderFromTransactionInputs(inputs: IUTXOInput[]): Sender {
    // TODO: Implement this when wallet.rs updates the transaction response
    return undefined
}

function getSenderFromOutput(output: OutputTypes): Sender {
    if (output.type !== OUTPUT_TYPE_TREASURY) {
        for (const unlockCondition of output.unlockConditions) {
            const senderAddress = getSenderAddressFromUnlockCondition(unlockCondition)
            if (senderAddress) {
                return {
                    type: 'address',
                    address: senderAddress,
                }
            }
        }
    }
    return undefined
}
