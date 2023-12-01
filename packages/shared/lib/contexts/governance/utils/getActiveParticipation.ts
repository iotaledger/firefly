import { get } from 'svelte/store'
import type { TrackedParticipationOverview } from '@iota/sdk/out/types'
import { participationOverviewForSelectedWallet } from '../stores/participation-overviews.store'

export function getActiveParticipation(proposalId: string): TrackedParticipationOverview {
    const overview = get(participationOverviewForSelectedWallet)
    const participationsForProposal: TrackedParticipationOverview[] = Object.values(
        overview?.participations?.[proposalId] ?? {}
    )
    return participationsForProposal.find((participation) => participation?.endMilestoneIndex === 0)
}
