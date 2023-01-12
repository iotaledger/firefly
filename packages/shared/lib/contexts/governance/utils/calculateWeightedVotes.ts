import { get } from 'svelte/store'
import { TrackedParticipationOverview } from '@iota/wallet'
import { networkStatus } from '@core/network/stores'
import { MILESTONE_NOT_FOUND } from '@core/network/constants'
import { localize } from '@core/i18n'

export function calculateWeightedVotes(participations: TrackedParticipationOverview[]): number[] {
    const { currentMilestone } = get(networkStatus)
    if (currentMilestone === MILESTONE_NOT_FOUND) {
        throw new Error(localize('dashboard.network.disconnected'))
    }

    const votes = participations.map(({ amount, startMilestoneIndex, endMilestoneIndex }) => {
        const endMilestone = endMilestoneIndex <= 0 ? currentMilestone : endMilestoneIndex
        return parseInt(amount) * (endMilestone - startMilestoneIndex)
    })
    return votes
}
