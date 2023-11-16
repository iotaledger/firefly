import { ActivityType } from '@core/wallet/enums'
import { BaseActivity } from './base-activity.type'

export type VestingActivity = BaseActivity & {
    type: ActivityType.Vesting
    rawAmount: number
    assetId: string
}
