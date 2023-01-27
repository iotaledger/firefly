import { get } from 'svelte/store'

import { EventId, TrackedParticipationOverview } from '@iota/wallet'

import { participationOverview } from '../stores'

export function getActiveParticipation(proposalId: EventId): TrackedParticipationOverview {
    const overview = get(participationOverview)
    const participationsForProposal: TrackedParticipationOverview[] = Object.values(
        overview?.participations?.[proposalId] ?? {}
    )
    return participationsForProposal.find((participation) => participation?.endMilestoneIndex === 0)
}
