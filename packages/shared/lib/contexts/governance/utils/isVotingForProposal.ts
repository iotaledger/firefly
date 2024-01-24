import { get } from 'svelte/store'
import type { TrackedParticipationOverview } from '@iota/sdk/out/types'
import { getParticipationsForProposal } from './getParticipationsForProposal'
import { selectedWalletId } from '@core/wallet'

// TODO(2.0): Update milestone by slot when TrackedParticipationOverview has been updated
export function isVotingForProposal(proposalId: string, walletId = get(selectedWalletId)): boolean {
    const participations = getParticipationsForProposal(proposalId, walletId) ?? {}
    const participationOutputs: TrackedParticipationOverview[] = Object.values(participations)
    return participationOutputs.some((output) => output?.endMilestoneIndex === 0)
}
