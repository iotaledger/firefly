import { get } from 'svelte/store'

import type { ParticipationOverview, TrackedParticipationOverview } from '@iota/wallet'

import { participationOverview } from '@contexts/governance/stores'
import { getParticipationOverview, selectedAccountIndex } from '@core/account'

export async function isVotingForProposal(
    proposalId: string,
    accountIndex = get(selectedAccountIndex)
): Promise<boolean> {
    let overview: ParticipationOverview
    if (accountIndex === get(selectedAccountIndex)) {
        overview = get(participationOverview)
    } else {
        overview = await getParticipationOverview(accountIndex)
    }

    const participations = overview?.participations?.[proposalId] ?? {}
    const participationOutputs: TrackedParticipationOverview[] = Object.values(participations)
    return participationOutputs.some((output) => output?.endMilestoneIndex === 0)
}
