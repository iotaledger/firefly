import { get } from 'svelte/store'

import type { ParticipationOverview, TrackedParticipationOverview } from '@iota/wallet'

import { participationOverview } from '@contexts/governance/stores'
import { getParticipationOverview, selectedAccount } from '@core/account'

export async function getParticipationsForProposal(
    proposalId: string,
    account = get(selectedAccount)
): Promise<{ [outputId: string]: TrackedParticipationOverview }> {
    let overview: ParticipationOverview
    if (account === get(selectedAccount)) {
        overview = get(participationOverview)
    } else {
        overview = await getParticipationOverview(account)
    }

    return overview?.participations?.[proposalId]
}
