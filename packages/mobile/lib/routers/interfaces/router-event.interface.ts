import { IRouterEvent } from '@core/router'
import { Activity } from '@core/wallet'

import { ActivityAction } from '../../../lib/contexts/dashboard'

export interface IActivityRouterEvent extends IRouterEvent {
    activity?: Activity
    action?: ActivityAction
    isUnlocked?: boolean
}
