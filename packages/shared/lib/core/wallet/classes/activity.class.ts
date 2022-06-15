import { IAccountState } from '@core/account'
import { localize } from '@core/i18n'
import { BASE_TOKEN, NETWORK } from '@core/network'
import { activeProfile } from '@core/profile'
import { OutputTypes } from '@iota/types'
import { OutputData, OutputOptions, Transaction } from '@iota/wallet'
import { convertToFiat, formatCurrency } from '@lib/currency'
import { truncateString } from '@lib/helpers'
import { findAccountWithAddress } from '@lib/wallet'
import { MILLISECONDS_PER_SECOND } from 'shared/lib/time'
import { get } from 'svelte/store'
import {
    OUTPUT_TYPE_TREASURY,
    UNLOCK_CONDITION_EXPIRATION,
    UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN,
} from '../constants'
import { ActivityAsyncStatus, ActivityDirection, ActivityType, InclusionState } from '../enums'
import { IActivity } from '../interfaces'
import { ITokenMetadata } from '../interfaces/token-metadata.interface'
import { isActivityHiddenForAccountId } from '../stores/hidden-activities.store'
import { Recipient, Sender } from '../types'
import {
    formatTokenAmountBestMatch,
    getAmountFromOutput,
    getExpirationDateFromOutput,
    getMetadataFromOutput,
    getRecipientAddressFromOutput,
    getRecipientFromOutput,
    getSenderFromOutput,
    getStorageDepositFromOutput,
    getTagFromOutput,
    isOutputAsync,
} from '../utils'
import { getNonRemainderOutputFromTransaction, getSenderFromTransactionInputs } from '../utils/transactions'
export class Activity implements IActivity {
    type: ActivityType
    id: string
    isHidden?: boolean

    transactionId?: string
    inclusionState: InclusionState
    time: Date

    sender: Sender
    recipient: Recipient
    subject: Sender | Recipient
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

        this.type = getActivityType(isInternal)
        this.id = transactionId
        this.isHidden = false

        this.transactionId = transactionId
        this.inclusionState = InclusionState.Pending
        this.time = new Date()

        this.sender = { type: 'account', account: senderAccount }
        this.recipient = isInternal
            ? { type: 'account', account: account }
            : { type: 'address', address: outputOptions.recipientAddress }
        this.subject = this.recipient
        this.isInternal = isInternal
        this.direction = ActivityDirection.Out

        this.rawAmount = Number(outputOptions.amount)
        this.token = BASE_TOKEN[get(activeProfile).networkProtocol]
        this.metadata = outputOptions?.features.metadata
        this.tag = outputOptions?.features.tag

        this.storageDeposit = Number(output.amount) - Number(outputOptions.amount)
        this.expirationDate = new Date(Number(outputOptions?.unlocks?.expiration?.unixTime) * MILLISECONDS_PER_SECOND)
        this.isAsync =
            outputOptions?.storageDeposit > 0 ||
            !!(outputOptions?.unlocks?.expiration?.milestoneIndex || outputOptions?.unlocks?.expiration?.unixTime)
        this.isClaimed = false

        return this
    }

    setFromTransaction(transactionId: string, transaction: Transaction, account: IAccountState): Activity {
        const output: OutputTypes = getNonRemainderOutputFromTransaction(transaction, account.depositAddress)
        const recipient = getRecipientFromOutput(output)

        this.type = getActivityType(isRecipientInternal(recipient))
        this.id = transactionId
        this.isHidden = isActivityHiddenForAccountId(account.id, this.id)

        this.transactionId = transactionId
        this.inclusionState = transaction.inclusionState
        this.time = new Date(Number(transaction.timestamp))

        this.sender = getSenderFromTransaction(transaction, account.depositAddress)
        this.recipient = recipient
        this.subject = transaction.incoming ? this.sender : this.recipient
        this.isInternal = isRecipientInternal(recipient)
        this.direction = transaction.incoming ? ActivityDirection.In : ActivityDirection.Out

        this.storageDeposit = getStorageDepositFromOutput(output)
        this.rawAmount = getAmountFromOutput(output) - this.storageDeposit
        this.token = BASE_TOKEN[get(activeProfile).networkProtocol]
        this.metadata = getMetadataFromOutput(output)
        this.tag = getTagFromOutput(output)

        this.expirationDate = getExpirationDateFromOutput(output)
        this.isAsync = isOutputAsync(output)
        this.isClaimed = false

        return this
    }

    setFromOutputData(outputData: OutputData, account: IAccountState): Activity {
        const recipientAddress = getRecipientAddressFromOutput(outputData.output)
        const recipient = getRecipientFromOutput(outputData.output)
        const isIncoming = recipientAddress === account.depositAddress
        // const isInternal = !!findAccountWithAddress(address)
        const isInternal = isRecipientInternal(recipient)

        this.type = getActivityType(isInternal)
        this.id = outputData.outputId
        this.isHidden = isActivityHiddenForAccountId(account.id, this.id)

        this.transactionId = outputData?.metadata?.transactionId
        this.inclusionState = InclusionState.Confirmed
        this.time = new Date(outputData.metadata.milestoneTimestampBooked * MILLISECONDS_PER_SECOND)

        this.sender = getSenderFromOutput(outputData.output)
        this.recipient = recipient
        this.subject = isIncoming ? this.sender : this.recipient
        this.isInternal = isInternal
        this.direction = isIncoming ? ActivityDirection.In : ActivityDirection.Out

        this.outputId = outputData.outputId
        this.token = BASE_TOKEN[get(activeProfile).networkProtocol]

        this.storageDeposit = getStorageDepositFromOutput(outputData.output)
        this.rawAmount = getAmountFromOutput(outputData.output) - this.storageDeposit
        this.expirationDate = getExpirationDateFromOutput(outputData.output)
        this.isAsync = isOutputAsync(outputData.output)

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

    getTimeDiffUntilExpirationTime(time: Date): string {
        if (this.isAsync && !this.isClaimed && this?.expirationDate) {
            const elapsedTime = this.expirationDate.getTime() - time.getTime()
            const days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24))
            const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24)
            const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60)

            if (days > 0 || hours > 0) {
                return `${days}d ${hours}h`
            } else if (minutes > 0) {
                return `${minutes}min`
            } else {
                return '-'
            }
        }
        return undefined
    }

    getTitle(): string {
        let title = ''
        if (this.type === ActivityType.InternalTransaction) {
            title = this.inclusionState === InclusionState.Confirmed ? 'general.transfer' : 'general.transferring'
        } else if (this.type === ActivityType.ExternalTransaction) {
            if (this.direction === ActivityDirection.In) {
                title = this.inclusionState === InclusionState.Confirmed ? 'general.received' : 'general.receiving'
            } else if (this.direction === ActivityDirection.Out) {
                title = this.inclusionState === InclusionState.Confirmed ? 'general.sent' : 'general.sending'
            }
        }
        return title
    }

    getIcon(): { icon: string; iconColor: string } {
        let icon = ''
        let iconColor = ''
        if (this.type === ActivityType.InternalTransaction) {
            icon = 'transfer'
            iconColor = 'gray-600'
        } else if (this.type === ActivityType.ExternalTransaction) {
            if (this.direction === ActivityDirection.In) {
                icon = 'chevron-down'
                iconColor = 'blue-700'
            } else if (this.direction === ActivityDirection.Out) {
                icon = 'chevron-up'
                iconColor = 'blue-500'
            }
        }
        return { icon, iconColor }
    }

    getFormattedSubject(): string {
        let subject = ''
        if (this?.subject?.type === 'account') {
            subject = truncateString(this?.subject?.account?.name, 13, 0)
        } else if (this?.subject?.type === 'address') {
            const hrp = NETWORK?.[get(activeProfile).networkProtocol]?.[get(activeProfile).networkType]?.bech32Hrp
            subject = truncateString(this?.subject?.address, hrp.length, 6)
        } else {
            subject = localize('general.unknownAddress')
        }
        return subject
    }
}

function getActivityType(internal: boolean): ActivityType {
    if (internal) {
        return ActivityType.InternalTransaction
    } else {
        return ActivityType.ExternalTransaction
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
