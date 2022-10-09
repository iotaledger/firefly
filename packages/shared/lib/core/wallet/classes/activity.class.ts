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
    IAliasActivityData,
    INftActivityData,
} from '../interfaces'
import {
    formatTokenAmountBestMatch,
    getActivityType,
    getAssetFromPersistedAssets,
    getFoundryActivityData,
    getNftActivityData,
    getTransactionActivityData,
} from '../utils'
import { IUTXOInput } from '@iota/types'
import { getAliasActivityData } from '../utils/outputs/getAliasActivityData'

export class Activity implements IActivity {
    id: string
    transactionId: string
    type: ActivityType
    time: Date
    inclusionState: InclusionState
    inputs: IUTXOInput[]
    isHidden?: boolean
    isAssetHidden: boolean

    data: ITransactionActivityData | IFoundryActivityData | IAliasActivityData | INftActivityData

    constructor(processedTransaction: IProcessedTransaction, account: IAccountState) {
        const { outputs, transactionId, time, inclusionState, transactionInputs } = processedTransaction

        const type = getActivityType(outputs)

        this.type = type
        this.isHidden = false

        this.transactionId = transactionId
        this.inclusionState = inclusionState
        this.time = time
        this.inputs = transactionInputs

        switch (type) {
            case ActivityType.Transaction:
                this.data = getTransactionActivityData(processedTransaction, account)
                break
            case ActivityType.Foundry:
                this.data = getFoundryActivityData(processedTransaction)
                break
            case ActivityType.Alias:
                this.data = getAliasActivityData(processedTransaction)
                break
            case ActivityType.Nft:
                this.data = getNftActivityData(processedTransaction)
                break
        }
        this.id = this.data.outputId || transactionId
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

    getFormattedAmount(signed: boolean = true): string {
        if (this.data.type === ActivityType.Alias || this.data.type === ActivityType.Nft) {
            return ''
        }
        const metadata = getAssetFromPersistedAssets(this.data.assetId)?.metadata
        const amount = formatTokenAmountBestMatch(this.data.rawAmount, metadata, 2)
        if (this.data.type === ActivityType.Transaction) {
            return `${this.data.direction !== ActivityDirection.Incoming && signed ? '- ' : ''}${amount}`
        } else {
            return amount
        }
    }

    getFiatAmount(fiatPrice?: number, exchangeRate?: number): string {
        if (
            fiatPrice &&
            exchangeRate &&
            !(this.data.type === ActivityType.Alias || this.data.type === ActivityType.Nft)
        ) {
            const fiatValue = formatCurrency(convertToFiat(this.data.rawAmount, fiatPrice, exchangeRate))
            return fiatValue ? fiatValue : ''
        } else {
            return ''
        }
    }
}
