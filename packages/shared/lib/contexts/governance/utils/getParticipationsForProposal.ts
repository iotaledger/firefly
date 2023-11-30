import { get } from 'svelte/store'

import type { ParticipationOverview, TrackedParticipationOverview } from '@iota/sdk/out/types'

import { allParticipationOverviews } from '@contexts/governance/stores'
import { selectedWalletId } from 'shared/lib/core/wallet'

export function getParticipationsForProposal(
    proposalId: string,
    walletId = get(selectedWalletId)
): { [outputId: string]: TrackedParticipationOverview } {
    const overview: ParticipationOverview = get(allParticipationOverviews)[walletId]
    return overview?.participations?.[proposalId]
}
