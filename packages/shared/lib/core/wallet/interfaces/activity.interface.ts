import { ActivityAsyncStatus, ActivityDirection, ActivityType, InclusionState } from '../enums'
import { Subject } from '../types'
import { IUTXOInput } from '@iota/types'

export interface IActivity {
    id: string
    outputId?: string
    transactionId?: string
    type: ActivityType
    time: Date
    direction: ActivityDirection
    inclusionState: InclusionState
    isInternal: boolean
    isSelfTransaction: boolean
    rawAmount: number
    sender: Subject
    recipient: Subject
    assetId: string
    isAsync: boolean
    asyncStatus: ActivityAsyncStatus
    expirationDate?: Date
    inputs: IUTXOInput[]
    isHidden?: boolean
    isAssetHidden: boolean
    isRejected: boolean
    isClaiming?: boolean
    isClaimed?: boolean
    publicNote?: string
    claimingTransactionId?: string
    claimedDate?: Date

    updateFromPartialActivity(partialActivity: Partial<IActivity>): void
    getAsyncStatus(time: Date): ActivityAsyncStatus
    getFormattedAmount(signum: boolean): string
    getFiatAmount(fiatPrice: number, exchangeRate: number): string
}
