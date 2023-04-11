import { baseToken } from '@core/profile'
import { GovernanceAction } from '@core/wallet/enums'
import { GovernanceActivity } from '@core/wallet/types'
import { get } from 'svelte/store'
import { formatTokenAmountBestMatch } from '../formatTokenAmountBestMatch'

export function getFormattedVotingPowerFromGovernanceActivity(activity: GovernanceActivity): string {
    const _baseToken = get(baseToken)
    if (
        activity.governanceAction === GovernanceAction.IncreaseVotingPower ||
        activity.governanceAction === GovernanceAction.DecreaseVotingPower
    ) {
        const amount = formatTokenAmountBestMatch(activity.votingPowerDifference, _baseToken, 2)
        return `${activity.governanceAction === GovernanceAction.DecreaseVotingPower ? '- ' : ''}${amount}`
    }
    // TODO
    return '0 SMR'
}
