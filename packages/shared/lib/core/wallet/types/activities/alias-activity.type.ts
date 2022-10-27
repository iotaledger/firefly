import { ActivityType, AliasType } from '@core/wallet/enums'
import { BaseActivity } from './base-activity.type'

export type AliasActivity = BaseActivity & {
    type: ActivityType.Alias
    aliasId: string
    aliasType: AliasType
    governorAddress: string
    stateControllerAddress: string
}
