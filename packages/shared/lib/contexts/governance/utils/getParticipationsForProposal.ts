import { get } from 'svelte/store'

import type { ParticipationOverview, TrackedParticipationOverview } from '@iota/wallet'

import { participationOverviewForSelectedAccount } from '@contexts/governance/stores'
import { getParticipationOverview } from '@core/account/api'
import { selectedAccountIndex } from '@core/account/stores'

export async function getParticipationsForProposal(
    proposalId: string,
    accountIndex = get(selectedAccountIndex)
): Promise<{ [outputId: string]: TrackedParticipationOverview }> {
    let overview: ParticipationOverview
    if (accountIndex === get(selectedAccountIndex)) {
        overview = get(participationOverviewForSelectedAccount)
    } else {
        overview = await getParticipationOverview(accountIndex)
    }

    return overview?.participations?.[proposalId]
}
