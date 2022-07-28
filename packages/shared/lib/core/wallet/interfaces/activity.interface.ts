import { IAccountState } from '@core/account'
import { Transaction } from '@iota/wallet'
import { ActivityAsyncStatus, ActivityDirection, ActivityType, InclusionState } from '../enums'
import { Subject } from '../types'

export interface IActivity {
    id: string
    outputId?: string
    transactionId?: string
    type: ActivityType
    time: Date
    direction: ActivityDirection
    inclusionState: InclusionState
    isInternal: boolean
    rawAmount: number
    sender: Subject
    recipient: Subject
    isSelfTransaction: boolean
    assetId: string
    isAsync: boolean
    asyncStatus: ActivityAsyncStatus
    expirationDate?: Date
    isHidden?: boolean
    isAssetHidden: boolean
    isClaiming?: boolean
    isClaimed?: boolean
    publicNote?: string
    claimingTransactionId?: string
    claimedDate?: Date

    updateFromPartialActivity(partialActivity: Partial<IActivity>): void
    setFromTransaction(transaction: Transaction, account: IAccountState): void
    getAsyncStatus(time: Date): ActivityAsyncStatus
    getFormattedAmount(signum: boolean): string
    getFiatAmount(fiatPrice: number, exchangeRate: number): string
}
