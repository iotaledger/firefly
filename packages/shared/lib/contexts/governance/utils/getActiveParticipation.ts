import { get } from 'svelte/store'
import type { TrackedParticipationOverview } from '@iota/wallet/out/types'
import { participationOverviewForSelectedAccount } from '../stores/participation-overviews.store'

export function getActiveParticipation(proposalId: string): TrackedParticipationOverview {
    const overview = get(participationOverviewForSelectedAccount)
    const participationsForProposal: TrackedParticipationOverview[] = Object.values(
        overview?.participations?.[proposalId] ?? {}
    )
    return participationsForProposal.find((participation) => participation?.endMilestoneIndex === 0)
}
