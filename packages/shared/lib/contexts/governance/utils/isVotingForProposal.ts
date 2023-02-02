import { get } from 'svelte/store'
import type { TrackedParticipationOverview } from '@iota/wallet'
import { selectedAccount } from '@core/account'
import { getParticipationsForProposal } from './getParticipationsForProposal'

export async function isVotingForProposal(proposalId: string, account = get(selectedAccount)): Promise<boolean> {
    const participations = (await getParticipationsForProposal(proposalId, account)) ?? {}
    const participationOutputs: TrackedParticipationOverview[] = Object.values(participations)
    return participationOutputs.some((output) => output?.endMilestoneIndex === 0)
}
