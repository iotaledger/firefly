import { get } from 'svelte/store'

import type { TrackedParticipationOverview } from '@iota/wallet'

import { participationOverview } from '../stores'

export function getActiveParticipation(proposalId: string): TrackedParticipationOverview {
    const overview = get(participationOverview)
    const participationsForProposal: TrackedParticipationOverview[] = Object.values(
        overview?.participations?.[proposalId] ?? {}
    )
    return participationsForProposal.find((participation) => participation?.endMilestoneIndex === 0)
}
