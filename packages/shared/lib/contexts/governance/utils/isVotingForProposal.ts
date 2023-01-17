import { get } from 'svelte/store'

import { TrackedParticipationOverview } from '@iota/wallet'

import { participationOverview } from '../stores'

export function isVotingForProposal(proposalId: string): boolean {
    const overview = get(participationOverview)
    const participations = overview?.participations?.[proposalId]
    if (participations) {
        const participationOutputs: TrackedParticipationOverview[] = Object.values(participations)
        return participationOutputs.some((output) => output?.endMilestoneIndex === 0)
    } else {
        return false
    }
}
