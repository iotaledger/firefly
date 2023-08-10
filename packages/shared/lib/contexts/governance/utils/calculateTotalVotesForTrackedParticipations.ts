import { get } from 'svelte/store'
import { TrackedParticipationOverview } from '@iota/sdk/out/types'
import { networkStatus } from '@core/network/stores'
import { MILESTONE_NOT_FOUND } from '@core/network/constants'

export function calculateTotalVotesForTrackedParticipations(
    trackedParticipations: TrackedParticipationOverview[]
): number {
    const { currentMilestone } = get(networkStatus)
    if (currentMilestone === MILESTONE_NOT_FOUND) {
        return 0
    } else {
        const votes = trackedParticipations.map((participation) =>
            calculateVotesInTrackedParticipation(participation, currentMilestone)
        )
        const totalVotes = votes?.reduce((accumulator, votes) => accumulator + votes, 0) ?? 0
        return totalVotes
    }
}

function calculateVotesInTrackedParticipation(
    trackedParticipation: TrackedParticipationOverview,
    currentMilestone: number
): number {
    const { amount, startMilestoneIndex, endMilestoneIndex } = trackedParticipation
    const endMilestone = endMilestoneIndex === 0 ? currentMilestone : endMilestoneIndex
    const range = endMilestone - startMilestoneIndex
    return range > 0 ? parseInt(amount) * range : parseInt(amount)
}
