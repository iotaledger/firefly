import { get } from 'svelte/store'
import { TrackedParticipationOverview } from '@iota/sdk/out/types'
import { networkStatus } from '@core/network/stores'
import { SLOT_NOT_FOUND } from '@core/network/constants'

export function calculateTotalVotesForTrackedParticipations(
    trackedParticipations: TrackedParticipationOverview[]
): number {
    const { currentSlot } = get(networkStatus)
    if (!currentSlot || currentSlot === SLOT_NOT_FOUND) {
        return 0
    } else {
        const votes = trackedParticipations.map((participation) =>
            calculateVotesInTrackedParticipation(participation, currentSlot)
        )
        const totalVotes = votes?.reduce((accumulator, votes) => accumulator + votes, 0) ?? 0
        return totalVotes
    }
}

// TODO(2.0): Update calculateVotesInTrackedParticipation when TrackedParticipationOverview has been updated
function calculateVotesInTrackedParticipation(
    trackedParticipation: TrackedParticipationOverview,
    currentSlot: number
): number {
    const { amount, startMilestoneIndex, endMilestoneIndex } = trackedParticipation
    const endMilestone = endMilestoneIndex === 0 ? currentSlot : endMilestoneIndex
    const range = endMilestone - startMilestoneIndex
    return range > 0 ? parseInt(amount) * range : parseInt(amount)
}
