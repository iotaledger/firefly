import { ActivityType } from '@core/wallet/enums'
import { BaseActivity } from './base-activity.type'

export type DelegationActivity = BaseActivity & {
    type: ActivityType.Delegation
    validatorAddress: string
    delegatedAmount: string
    delegationId: string
}
