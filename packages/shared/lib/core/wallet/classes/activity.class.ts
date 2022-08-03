import { IAccountState } from '@core/account'
import { localize } from '@core/i18n'
import { COIN_TYPE, networkHrp } from '@core/network'
import { IOutputResponse } from '@iota/types'
import { activeProfile } from '@core/profile'
import { OutputData, Transaction } from '@iota/wallet'
import { convertToFiat, formatCurrency } from '@lib/currency'
import { truncateString } from '@lib/helpers'
import {
    HOURS_PER_DAY,
    MILLISECONDS_PER_SECOND,
    MINUTES_PER_HOUR,
    SECONDS_PER_DAY,
    SECONDS_PER_MINUTE,
} from 'shared/lib/time'
import { get } from 'svelte/store'
import { tryGetAndStoreAssetFromPersistedAssets } from '../actions'
import { ActivityAsyncStatus, ActivityDirection, ActivityType, InclusionState } from '../enums'
import { IActivity } from '../interfaces'
import { isActivityHiddenForAccountId } from '../stores/hidden-activities.store'
import { getPersistedAsset } from '../stores/persisted-assets.store'
import { Subject } from '../types'
import {
    containsFoundryOutput,
    formatTokenAmountBestMatch,
    getActivityType,
    getAmountFromOutput,
    getAssetFromPersistedAssets,
    getExpirationDateFromOutput,
    getMetadataFromOutput,
    getNativeTokenFromOutput,
    getRecipientAddressFromOutput,
    getRecipientFromOutput,
    getSenderFromOutput,
    getStorageDepositFromOutput,
    getTagFromOutput,
    isOutputAsync,
    isSubjectInternal,
    outputIdFromTransactionData,
} from '../utils'
import { getRelevantOutputFromTransaction, getSenderFromTransaction, getSenderFromInputs } from '../utils/transactions'
import { IUTXOInput } from '@iota/types'

export class Activity implements IActivity {
    type: ActivityType
    id: string
    isHidden?: boolean

    transactionId?: string
    inclusionState: InclusionState
    time: Date

    sender: Subject
    recipient: Subject
    subject: Subject
    isSelfTransaction: boolean
    isInternal: boolean
    direction: ActivityDirection
    inputs: IUTXOInput[]

    outputId?: string
    rawAmount: number
    assetId: string
    isAssetHidden: boolean
    metadata?: string
    tag?: string

    storageDeposit?: number
    expirationDate?: Date
    isAsync: boolean
    asyncStatus: ActivityAsyncStatus
    isClaiming?: boolean = false
    isClaimed?: boolean
    claimingTransactionId?: string
    claimedDate?: Date

    async setFromTransaction(transaction: Transaction, account: IAccountState): Promise<Activity> {
        const isFoundry = containsFoundryOutput(transaction)
        const { output, outputIndex, isSelfTransaction } = getRelevantOutputFromTransaction(
            transaction,
            account.depositAddress,
            isFoundry
        )

        const recipient = getRecipientFromOutput(output)
        const nativeToken = getNativeTokenFromOutput(output)

        if (nativeToken) {
            await tryGetAndStoreAssetFromPersistedAssets(nativeToken?.id)
        }

        this.type = getActivityType(isSubjectInternal(recipient), isFoundry)
        this.id = transaction.transactionId
        this.isHidden = isActivityHiddenForAccountId(account.id, transaction.transactionId)

        this.transactionId = transaction.transactionId
        this.inclusionState = transaction.inclusionState
        this.time = new Date(Number(transaction.timestamp))
        this.inputs = transaction.payload.essence.inputs
        this.outputId = outputIdFromTransactionData(transaction.transactionId, outputIndex)

        this.sender = getSenderFromTransaction(transaction.incoming, account.depositAddress, output)
        this.recipient = recipient
        this.subject = transaction.incoming ? this.sender : this.recipient
        this.isSelfTransaction = isSelfTransaction
        this.isInternal = isSubjectInternal(recipient)
        this.direction =
            transaction.incoming || isSelfTransaction || isFoundry ? ActivityDirection.In : ActivityDirection.Out

        this.assetId = nativeToken?.id ?? String(COIN_TYPE[get(activeProfile).networkProtocol])
        const asset = getPersistedAsset(this.assetId)
        this.isAssetHidden = !asset || asset.hidden

        this.storageDeposit = getStorageDepositFromOutput(output)
        this.rawAmount = nativeToken ? Number(nativeToken?.amount) : getAmountFromOutput(output) - this.storageDeposit

        this.metadata = getMetadataFromOutput(output)
        this.tag = getTagFromOutput(output)
        this.expirationDate = getExpirationDateFromOutput(output)

        this.isAsync = isOutputAsync(output)
        this.asyncStatus = this.isAsync ? ActivityAsyncStatus.Unclaimed : null
        this.isClaimed = false

        return this
    }

    async setFromOutputData(
        outputData: OutputData,
        account: IAccountState,
        transactionInputs: IOutputResponse[]
    ): Promise<Activity> {
        const output = outputData.output

        const recipientAddress = getRecipientAddressFromOutput(output)
        const recipient = getRecipientFromOutput(output)
        const sender = transactionInputs ? getSenderFromInputs(transactionInputs) : getSenderFromOutput(output)
        const isIncoming = recipientAddress === account.depositAddress

        const nativeToken = getNativeTokenFromOutput(output)
        const subject = isIncoming ? sender : recipient
        const isInternal = isSubjectInternal(subject)

        if (nativeToken) {
            await tryGetAndStoreAssetFromPersistedAssets(nativeToken?.id)
        }

        this.type = getActivityType(isInternal)
        this.id = outputData.outputId
        this.isHidden = isActivityHiddenForAccountId(account.id, outputData.outputId)

        this.transactionId = outputData?.metadata?.transactionId
        this.inclusionState = InclusionState.Confirmed
        this.time = new Date(outputData.metadata.milestoneTimestampBooked * MILLISECONDS_PER_SECOND)

        this.sender = sender
        this.recipient = recipient
        this.subject = subject
        this.isSelfTransaction = false
        this.isInternal = isInternal
        this.direction = isIncoming ? ActivityDirection.In : ActivityDirection.Out

        this.outputId = outputData.outputId
        this.inputs =
            transactionInputs?.map((input) => ({
                type: 0,
                transactionId: input.metadata.transactionId,
                transactionOutputIndex: input.metadata.outputIndex,
            })) ?? []

        this.assetId = nativeToken?.id ?? String(COIN_TYPE[get(activeProfile).networkProtocol])
        const asset = getPersistedAsset(this.assetId)
        this.isAssetHidden = !asset || asset.hidden

        this.storageDeposit = getStorageDepositFromOutput(output)
        this.rawAmount = nativeToken ? Number(nativeToken?.amount) : getAmountFromOutput(output) - this.storageDeposit
        this.metadata = getMetadataFromOutput(output)
        this.tag = getTagFromOutput(output)

        this.expirationDate = getExpirationDateFromOutput(output)
        this.isAsync = isOutputAsync(output)
        this.asyncStatus = this.isAsync ? ActivityAsyncStatus.Unclaimed : null
        this.isClaimed = false

        return this
    }

    updateFromPartialActivity(partialActivity: Partial<IActivity>): void {
        Object.assign(this, partialActivity)
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
        const metadata = getAssetFromPersistedAssets(this?.assetId)?.metadata
        return `${this.direction !== ActivityDirection.In && signed ? '- ' : ''}${formatTokenAmountBestMatch(
            this.rawAmount,
            metadata,
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
            const days = Math.floor(elapsedTime / (MILLISECONDS_PER_SECOND * SECONDS_PER_DAY))
            const hours = Math.floor(
                (elapsedTime / (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR)) % HOURS_PER_DAY
            )
            const minutes = Math.floor(
                (elapsedTime / (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE)) % MINUTES_PER_HOUR
            )
            const seconds = Math.floor((elapsedTime / MILLISECONDS_PER_SECOND) % SECONDS_PER_MINUTE)

            if (days > 0 || hours > 0) {
                return `${days}d ${hours}h`
            } else if (minutes > 0) {
                return `${minutes}min`
            } else if (seconds > 0) {
                return '<1min'
            } else {
                return '-'
            }
        }
        return undefined
    }

    getTitle(): string {
        let title = ''
        if (this.type === ActivityType.Minting) {
            title = this.inclusionState === InclusionState.Confirmed ? 'general.minted' : 'general.minting'
        }
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
            subject = truncateString(this?.subject?.address, get(networkHrp).length, 6)
        } else {
            subject = localize('general.unknownAddress')
        }
        return subject
    }
}
