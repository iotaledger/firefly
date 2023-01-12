import { get } from 'svelte/store'
import { TrackedParticipationOverview } from '@iota/wallet'
import { networkStatus } from '@core/network/stores'

export function calculateWeightedVotes(participations: TrackedParticipationOverview[]): number[] {
    const { currentMilestone } = get(networkStatus)
    const votes = participations.map(({ amount, startMilestoneIndex, endMilestoneIndex }) => {
        const endMilestone = endMilestoneIndex <= 0 ? currentMilestone : endMilestoneIndex
        return parseInt(amount) * (endMilestone - startMilestoneIndex)
    })
    return votes
}
