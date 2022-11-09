import { ActivityType, AliasSubtype } from '@core/wallet/enums'
import { BaseActivity } from './base-activity.type'

export type AliasActivity = BaseActivity & {
    type: ActivityType.Alias
    aliasId: string
    aliasSubtype: AliasSubtype
    governorAddress: string
    stateControllerAddress: string
}
