import { get } from 'svelte/store'

import type { ParticipationOverview, TrackedParticipationOverview } from '@iota/wallet'

import { participationOverview } from '@contexts/governance/stores'
import { getParticipationOverview, selectedAccountIndex } from '@core/account'

export async function getParticipationsForProposal(
    proposalId: string,
    accountIndex = get(selectedAccountIndex)
): Promise<{ [outputId: string]: TrackedParticipationOverview }> {
    let overview: ParticipationOverview
    if (accountIndex === get(selectedAccountIndex)) {
        overview = get(participationOverview)
    } else {
        overview = await getParticipationOverview(accountIndex)
    }

    return overview?.participations?.[proposalId]
}
