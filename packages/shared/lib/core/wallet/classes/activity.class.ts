import { IAccountState } from '@core/account'
import { localize } from '@core/i18n'
import { networkHrp } from '@core/network'
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
import { FoundryActivityData, IActivity, IProcessedTransaction, TransactionActivityData } from '../interfaces'
import {
    formatTokenAmountBestMatch,
    getActivityType,
    getAssetFromPersistedAssets,
    getFoundryActivityData,
    getTransactionActivityData,
} from '../utils'
import { IUTXOInput } from '@iota/types'

export class Activity implements IActivity {
    id: string
    transactionId: string
    type: ActivityType
    time: Date
    inclusionState: InclusionState
    inputs: IUTXOInput[]
    isHidden?: boolean
    isAssetHidden: boolean

    data: TransactionActivityData | FoundryActivityData

    constructor(processedTransaction: IProcessedTransaction, account: IAccountState) {
        const { outputs, transactionId, time, inclusionState, transactionInputs } = processedTransaction

        const type = getActivityType(outputs)

        this.type = type
        this.isHidden = false

        this.transactionId = transactionId
        this.inclusionState = inclusionState
        this.time = time
        this.inputs = transactionInputs

        this.id = transactionId

        if (type === ActivityType.Transaction) {
            this.data = getTransactionActivityData(processedTransaction, account)
        } else if (type === ActivityType.Foundry) {
            this.data = getFoundryActivityData(processedTransaction)
        }
    }

    updateFromPartialActivity(partialActivity: Partial<IActivity>): void {
        Object.assign(this, partialActivity)
    }

    updateDataFromPartialActivity(partialData: Partial<TransactionActivityData | FoundryActivityData>): void {
        if (partialData.type === this.data.type) {
            Object.assign(this.data, partialData)
        }
    }

    getAsyncStatus(time: Date): ActivityAsyncStatus {
        if (this.data.type === 'transaction' && this.data.isAsync) {
            if (this.data.isClaimed) {
                return ActivityAsyncStatus.Claimed
            } else {
                if (time > this.data.expirationDate) {
                    return ActivityAsyncStatus.Expired
                } else {
                    return ActivityAsyncStatus.Unclaimed
                }
            }
        }
        return null
    }

    getFormattedAmount(signed: boolean): string {
        const metadata = getAssetFromPersistedAssets(this.data.assetId)?.metadata
        const amount = formatTokenAmountBestMatch(this.data.rawAmount, metadata, 2)
        if (this.data.type === 'transaction') {
            return `${this.data.direction !== ActivityDirection.In && signed ? '- ' : ''}${amount}`
        } else {
            return amount
        }
    }

    getFiatAmount(fiatPrice?: number, exchangeRate?: number): string {
        if (fiatPrice && exchangeRate) {
            const fiatValue = formatCurrency(convertToFiat(this.data.rawAmount, fiatPrice, exchangeRate))
            return fiatValue ? fiatValue : '-'
        } else {
            return '-'
        }
    }

    getTimeDiffUntilExpirationTime(time: Date): string {
        if (
            this.data.type === 'transaction' &&
            this.data.isAsync &&
            !this.data.isClaimed &&
            this.data?.expirationDate
        ) {
            const elapsedTime = this.data.expirationDate.getTime() - time.getTime()
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
        if (this.data.type === 'transaction') {
            if (this.data.isInternal) {
                title = this.inclusionState === InclusionState.Confirmed ? 'general.transfer' : 'general.transferring'
            } else {
                if (this.data.direction === ActivityDirection.In) {
                    title = this.inclusionState === InclusionState.Confirmed ? 'general.received' : 'general.receiving'
                } else if (this.data.direction === ActivityDirection.Out) {
                    title = this.inclusionState === InclusionState.Confirmed ? 'general.sent' : 'general.sending'
                }
            }
        } else {
            title = this.inclusionState === InclusionState.Confirmed ? 'general.minted' : 'general.minting'
        }
        return title
    }

    getFormattedSubject(): string {
        if (this.data.type === 'transaction') {
            let subject = ''
            if (this.data.subject?.type === 'account') {
                subject = truncateString(this.data.subject?.account?.name, 13, 0)
            } else if (this.data.subject?.type === 'address') {
                subject = truncateString(this.data.subject?.address, get(networkHrp).length, 6)
            } else {
                subject = localize('general.unknownAddress')
            }
            return subject
        } else {
            return ''
        }
    }
}
