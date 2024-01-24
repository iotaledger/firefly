import type { TrackedParticipationOverview } from '@iota/sdk/out/types'
import { getParticipationsForProposal } from './getParticipationsForProposal'
import { get } from 'svelte/store'
import { selectedWalletId } from 'shared/lib/core/wallet'

export function isVotingForProposal(proposalId: string, walletId = get(selectedWalletId)): boolean {
    const participations = getParticipationsForProposal(proposalId, walletId) ?? {}
    const participationOutputs: TrackedParticipationOverview[] = Object.values(participations)
    return participationOutputs.some((output) => output?.endMilestoneIndex === 0)
}
