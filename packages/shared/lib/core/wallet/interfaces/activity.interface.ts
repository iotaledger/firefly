import { ActivityAsyncStatus, ActivityType, InclusionState } from '../enums'
import { IUTXOInput } from '@iota/types'
import { ITransactionActivityData } from './transaction-activity-data.interface'
import { IFoundryActivityData } from './foundry-activity-data.interface'
import { IAliasActivityData } from './alias-activity-data.interface'
import { INftActivityData } from './nft-activity-data.interface'

export interface IActivity {
    id: string
    transactionId?: string
    type: ActivityType
    time: Date
    inclusionState: InclusionState
    inputs: IUTXOInput[]
    isHidden?: boolean
    containsValue: boolean
    isAssetHidden: boolean

    data: ITransactionActivityData | IFoundryActivityData | IAliasActivityData | INftActivityData

    updateFromPartialActivity(partialActivity: Partial<IActivity>): void
    getAsyncStatus(time: Date): ActivityAsyncStatus
    getFormattedAmount(signum: boolean): string
    getFiatAmount(fiatPrice: number, exchangeRate: number): string
}
