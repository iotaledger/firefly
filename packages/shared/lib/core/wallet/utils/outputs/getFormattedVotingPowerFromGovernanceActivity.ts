import { getBaseToken } from '@core/profile'
import { GovernanceAction } from '@core/wallet/enums'
import { GovernanceActivity } from '@core/wallet/types'
import { formatTokenAmountBestMatch } from '../formatTokenAmountBestMatch'

export function getFormattedVotingPowerFromGovernanceActivity(activity: GovernanceActivity): string {
    if (
        activity.governanceAction === GovernanceAction.IncreaseVotingPower ||
        activity.governanceAction === GovernanceAction.DecreaseVotingPower
    ) {
        const amount = formatTokenAmountBestMatch(activity.votingPowerDifference, getBaseToken())
        return `${activity.governanceAction === GovernanceAction.DecreaseVotingPower ? '- ' : ''}${amount}`
    }
    // TODO
    return '0 SMR'
}
