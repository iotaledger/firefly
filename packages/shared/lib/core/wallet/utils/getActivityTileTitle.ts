import { ActivityAction, ActivityDirection, ActivityType, GovernanceAction, InclusionState } from '../enums'
import { Activity } from '../types'

export function getActivityTileTitle(activity: Activity): string {
    const { type, isInternal, direction, inclusionState, action } = activity
    const isConfirmed = inclusionState === InclusionState.Confirmed

    if (activity.type === ActivityType.Basic && activity.isShimmerClaiming) {
        return isConfirmed ? 'general.shimmerClaimed' : 'general.shimmerClaiming'
    }
    if (activity.type === ActivityType.Governance) {
        if (activity.governanceAction === GovernanceAction.IncreaseVotingPower) {
            return isConfirmed ? 'general.increased' : 'general.increasing'
        } else if (activity.governanceAction === GovernanceAction.DecreaseVotingPower) {
            return isConfirmed ? 'general.decreased' : 'general.decreasing'
        } else if (activity.governanceAction === GovernanceAction.StartVoting) {
            return isConfirmed ? 'general.voted' : 'general.voting'
        } else if (activity.governanceAction === GovernanceAction.StopVoting) {
            return isConfirmed ? 'general.unvoted' : 'general.unvoting'
        } else if (activity.governanceAction === GovernanceAction.ChangedVote) {
            return isConfirmed ? 'general.changedVote' : 'general.changingVote'
        } else if (activity.governanceAction === GovernanceAction.Revote) {
            return isConfirmed ? 'general.revoted' : 'general.revoting'
        }
    } else if (activity.type === ActivityType.Consolidation) {
        return isConfirmed ? 'general.consolidated' : 'general.consolidating'
    } else if (action === ActivityAction.Mint) {
        if (type === ActivityType.Alias) {
            return isConfirmed ? 'general.aliasCreated' : 'general.creatingAlias'
        }
        return isConfirmed ? 'general.minted' : 'general.minting'
    } else if (action === ActivityAction.Burn) {
        return isConfirmed ? 'general.burned' : 'general.burning'
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
    } else {
        return 'general.unknown'
    }
}
