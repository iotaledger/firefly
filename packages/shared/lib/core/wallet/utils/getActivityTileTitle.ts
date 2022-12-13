import { ActivityAction, ActivityDirection, ActivityType, InclusionState } from '../enums'
import { Activity } from '../types'

export function getActivityTileTitle(activity: Activity): string {
    const { type, isInternal, direction, inclusionState, action } = activity
    const isConfirmed = inclusionState === InclusionState.Confirmed

    if (activity.type === ActivityType.Basic && activity.isShimmerClaiming) {
        return isConfirmed ? 'general.shimmerClaimed' : 'general.shimmerClaiming'
    } else if (action === ActivityAction.Mint) {
        if (type === ActivityType.Alias) {
            return isConfirmed ? 'general.aliasCreated' : 'general.creatingAlias'
        }
        return isConfirmed ? 'general.minted' : 'general.minting'
    } else if (action === ActivityAction.Send) {
        if (isInternal) {
            return isConfirmed ? 'general.transfer' : 'general.transferring'
        }
        if (direction === ActivityDirection.Incoming || direction === ActivityDirection.SelfTransaction) {
            return isConfirmed ? 'general.received' : 'general.receiving'
        }
        if (direction === ActivityDirection.Outgoing) {
            return isConfirmed ? 'general.sent' : 'general.sending'
        }
    } else if (action === ActivityAction.Unknown) {
        return 'general.unknownAction'
    }
}
