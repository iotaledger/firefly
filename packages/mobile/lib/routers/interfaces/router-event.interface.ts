import { IRouterEvent } from '@core/router'
import { Activity } from '@core/wallet'

export interface IActivityRouterEvent extends IRouterEvent {
    activity?: Activity
    /* @TODO: remove magic strings */
    action?: 'claim' | 'fastClaim' | 'reject' | 'fastReject'
    isUnlocked?: boolean
}
