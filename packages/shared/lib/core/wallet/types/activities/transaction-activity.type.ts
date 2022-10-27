import { ActivityType } from '@core/wallet/enums'
import { BaseActivity } from './base-activity.type'

export type TransactionActivity = BaseActivity & {
    type: ActivityType.Transaction
    rawAmount: number
    assetId: string
    publicNote: string
    metadata: string
    tag: string
    isShimmerClaiming: boolean
}
