import { IAccountState } from '@core/account'
import { localize } from '@core/i18n'
import { COIN_TYPE, networkHrp } from '@core/network'
import { activeProfile } from '@core/profile'
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
import { ActivityAsyncStatus, ActivityDirection, ActivityType, InclusionState } from '../enums'
import { IActivity, IProcessedTransaction } from '../interfaces'
import { isActivityHiddenForAccountId } from '../stores/hidden-activities.store'
import { getPersistedAsset } from '../stores/persisted-assets.store'
import { Subject } from '../types'
import {
    formatTokenAmountBestMatch,
    getActivityType,
    getAmountFromOutput,
    getAssetFromPersistedAssets,
    getExpirationDateFromOutput,
    getMetadataFromOutput,
    getNativeTokenFromOutput,
    getRecipientAddressFromOutput,
    getRecipientFromOutput,
    getStorageDepositFromOutput,
    getTagFromOutput,
    isOutputAsync,
    isSubjectInternal,
    outputIdFromTransactionData,
} from '../utils'
import {
    getSenderFromTransaction,
    getSenderFromInputs,
    getMainTransactionOutputFromTransaction,
    getFoundryOutputFromTransaction,
} from '../utils/transactions'
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
    isRejected: boolean
    metadata?: string
    tag?: string

    storageDeposit?: number
    giftedStorageDeposit?: number
    expirationDate?: Date
    isAsync: boolean
    asyncStatus: ActivityAsyncStatus
    isClaiming?: boolean = false
    isClaimed?: boolean
    claimingTransactionId?: string
    claimedDate?: Date

    constructor(processedOutput: IProcessedTransaction, account: IAccountState) {
        const { outputs, transactionId, time, inclusionState, transactionInputs, detailedTransactionInputs } =
            processedOutput

        // TODO: We can move this logic in the processing step, so that we can create different Activity classes for different types
        const type = getActivityType(outputs)

        this.type = type
        this.isHidden = false

        this.transactionId = transactionId
        this.inclusionState = inclusionState
        this.time = time
        this.inputs = transactionInputs

        if (type === ActivityType.Transaction) {
            let isIncoming = false
            const { output, outputIndex, isSelfTransaction } = getMainTransactionOutputFromTransaction(
                outputs,
                account.depositAddress,
                isIncoming
            )

            this.id = outputIdFromTransactionData(transactionId, outputIndex)
            this.outputId = outputIdFromTransactionData(transactionId, outputIndex) // Only required for async transactions e.g. when claimed or to get the full output with `getOutput`

            const recipientAddress = getRecipientAddressFromOutput(output)
            const recipient = getRecipientFromOutput(output)

            isIncoming = recipientAddress === account.depositAddress && !isSelfTransaction
            const sender = detailedTransactionInputs
                ? getSenderFromInputs(detailedTransactionInputs)
                : getSenderFromTransaction(isIncoming, account.depositAddress, output)

            const subject = isIncoming ? sender : recipient
            const isInternal = isSubjectInternal(subject)
            this.isInternal = isInternal

            this.sender = sender
            this.recipient = recipient
            this.subject = subject

            this.direction = isIncoming || isSelfTransaction ? ActivityDirection.In : ActivityDirection.Out

            this.isAsync = isOutputAsync(output)
            this.asyncStatus = this.isAsync ? ActivityAsyncStatus.Unclaimed : null
            this.isClaimed = false

            const nativeToken = getNativeTokenFromOutput(output)

            this.assetId = nativeToken?.id ?? String(COIN_TYPE[get(activeProfile).networkProtocol])
            const asset = getPersistedAsset(this.assetId)
            this.isAssetHidden = !asset || asset.hidden
            this.isRejected = isActivityHiddenForAccountId(account.id, transactionId)

            const { storageDeposit, giftedStorageDeposit } = getStorageDepositFromOutput(output)
            this.storageDeposit = storageDeposit
            this.giftedStorageDeposit = giftedStorageDeposit
            this.rawAmount = nativeToken
                ? Number(nativeToken?.amount)
                : getAmountFromOutput(output) - this.storageDeposit

            this.metadata = getMetadataFromOutput(output)
            this.tag = getTagFromOutput(output)
            this.expirationDate = getExpirationDateFromOutput(output)
        } else if (type === ActivityType.Foundry) {
            const { output, outputIndex } = getFoundryOutputFromTransaction(outputs)
            this.id = outputIdFromTransactionData(transactionId, outputIndex)
            this.outputId = outputIdFromTransactionData(transactionId, outputIndex) // not required for foundry activities

            const nativeToken = getNativeTokenFromOutput(output)

            this.assetId = nativeToken?.id ?? String(COIN_TYPE[get(activeProfile).networkProtocol])
            const asset = getPersistedAsset(this.assetId)
            this.isAssetHidden = !asset || asset.hidden

            const { storageDeposit, giftedStorageDeposit } = getStorageDepositFromOutput(output) // probably we need to sum up all storage deposits
            this.storageDeposit = storageDeposit
            this.giftedStorageDeposit = giftedStorageDeposit
            this.rawAmount = nativeToken
                ? Number(nativeToken?.amount)
                : getAmountFromOutput(output) - this.storageDeposit
        }
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
        return `${
            this.direction !== ActivityDirection.In && signed && this.type === ActivityType.Transaction ? '- ' : ''
        }${formatTokenAmountBestMatch(this.rawAmount, metadata, 2)}`
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
        if (this.type === ActivityType.Foundry) {
            title = this.inclusionState === InclusionState.Confirmed ? 'general.minted' : 'general.minting'
        } else if (this.isInternal) {
            title = this.inclusionState === InclusionState.Confirmed ? 'general.transfer' : 'general.transferring'
        } else {
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
        if (this.isInternal) {
            icon = 'transfer'
            iconColor = 'gray-600'
        } else {
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
