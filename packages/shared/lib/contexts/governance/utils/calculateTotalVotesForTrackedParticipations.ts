import { TrackedParticipationOverview } from '@iota/wallet'

export function calculateTotalVotesForTrackedParticipations(
    trackedParticipations: TrackedParticipationOverview[],
    currentMilestone: number
): number {
    const votes = trackedParticipations.map((participation) =>
        calculateVotesInTrackedParticipation(participation, currentMilestone)
    )
    const totalVotes = votes?.reduce((accumulator, votes) => accumulator + votes, 0) ?? 0
    return totalVotes
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
