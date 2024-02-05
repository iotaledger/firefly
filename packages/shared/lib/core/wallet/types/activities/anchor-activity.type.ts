import { ActivityType } from '@core/wallet/enums'
import { BaseActivity } from './base-activity.type'

export type AnchorActivity = BaseActivity & {
    type: ActivityType.Anchor
    governorAddress: string
    stateControllerAddress: string
}
