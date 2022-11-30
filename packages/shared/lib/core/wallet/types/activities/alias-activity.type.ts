import { ActivityType } from '@core/wallet/enums'
import { BaseActivity } from './base-activity.type'

export type AliasActivity = BaseActivity & {
    type: ActivityType.Alias
    aliasId: string
    governorAddress: string
    stateControllerAddress: string
}
