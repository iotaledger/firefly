import { ActivityType } from '@core/wallet/enums'
import { BaseActivity } from './base-activity.type'

export type AccountActivity = BaseActivity & {
    type: ActivityType.Account
    accountId: string
}
