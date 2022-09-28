import { IAccountState } from '@core/account'
import { convertToFiat, formatCurrency } from '@lib/currency'
import { ActivityAsyncStatus, ActivityDirection, ActivityType, InclusionState } from '../enums'
import {
    IFoundryActivityData,
    IActivity,
    IPartialFoundryActivityDataWithType,
    IPartialTransactionActivityDataWithType,
    IProcessedTransaction,
    ITransactionActivityData,
} from '../interfaces'
import {
    formatTokenAmountBestMatch,
    getActivityType,
    getAssetFromPersistedAssets,
    getFoundryActivityData,
    getTransactionActivityData,
} from '../utils'
import { IUTXOInput } from '@iota/types'
import { containsFunds } from '../utils/transactions/containsFunds'

export class Activity implements IActivity {
    id: string
    transactionId: string
    type: ActivityType
    time: Date
    inclusionState: InclusionState
    inputs: IUTXOInput[]
    isHidden?: boolean
    isAssetHidden: boolean

    data: ITransactionActivityData | IFoundryActivityData

    constructor(processedTransaction: IProcessedTransaction, account: IAccountState) {
        const { outputs, transactionId, time, inclusionState, transactionInputs } = processedTransaction

        const type = getActivityType(outputs)

        this.type = type
        this.isHidden = !containsFunds(processedTransaction, account)

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

    updateDataFromPartialActivity(
        partialData: IPartialTransactionActivityDataWithType | IPartialFoundryActivityDataWithType
    ): void {
        if (partialData.type === ActivityType.Transaction && this.data.type === ActivityType.Transaction) {
            this.data = { ...this.data, ...partialData }
        } else if (partialData.type === ActivityType.Foundry && this.data.type === ActivityType.Foundry) {
            this.data = { ...this.data, ...partialData }
        }
    }

    getAsyncStatus(time: Date): ActivityAsyncStatus {
        if (this.data.type === ActivityType.Transaction) {
            if (this.data.timelockDate) {
                if (this.data.timelockDate.getTime() > time.getTime()) {
                    return ActivityAsyncStatus.Timelocked
                }
            }
            if (this.data.isAsync) {
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
        }
        return null
    }

    getFormattedAmount(signed: boolean): string {
        const metadata = getAssetFromPersistedAssets(this.data.assetId)?.metadata
        const amount = formatTokenAmountBestMatch(this.data.rawAmount, metadata, 2)
        if (this.data.type === ActivityType.Transaction) {
            return `${this.data.direction !== ActivityDirection.In && signed ? '- ' : ''}${amount}`
        } else {
            return amount
        }
    }

    getFiatAmount(fiatPrice?: number, exchangeRate?: number): string {
        if (fiatPrice && exchangeRate) {
            const fiatValue = formatCurrency(convertToFiat(this.data.rawAmount, fiatPrice, exchangeRate))
            return fiatValue ? fiatValue : ''
        } else {
            return ''
        }
    }
}
