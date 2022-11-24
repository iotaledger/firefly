import { Activity } from '@core/wallet'

import { ActivityAction } from '../../contexts/dashboard'

export interface IActivityRouterEvent {
    activity?: Activity
    action?: ActivityAction
    isUnlocked?: boolean
}
