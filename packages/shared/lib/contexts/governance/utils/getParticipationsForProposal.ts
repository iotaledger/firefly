import { get } from 'svelte/store'
import type { ParticipationOverview, TrackedParticipationOverview } from '@iota/sdk/out/types'
import { allParticipationOverviews } from '@contexts/governance/stores'
import { selectedWalletId } from '@core/wallet'

export function getParticipationsForProposal(proposalId: string): { [outputId: string]: TrackedParticipationOverview } {
    const walletId = get(selectedWalletId)
    const overview: ParticipationOverview = get(allParticipationOverviews)[walletId]
    return overview?.participations?.[proposalId]
}
