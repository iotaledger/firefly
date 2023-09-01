import { get } from 'svelte/store'

import type { ParticipationOverview, TrackedParticipationOverview } from '@iota/sdk/out/types'

import { allParticipationOverviews } from '@contexts/governance/stores'
import { selectedAccountIndex } from '@core/account/stores'

export function getParticipationsForProposal(
    proposalId: string,
    accountIndex = get(selectedAccountIndex)
): { [outputId: string]: TrackedParticipationOverview } {
    const overview: ParticipationOverview = get(allParticipationOverviews)[accountIndex]
    return overview?.participations?.[proposalId]
}
