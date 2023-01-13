import { get } from 'svelte/store'

import { TrackedParticipationOverview } from '@iota/wallet'

import { selectedAccount } from '@core/account/stores'
import { getParticipationOverview } from '@core/account/api'

export async function isVotingForProposal(proposalId: string, accountIndex?: number): Promise<boolean> {
    const _accountIndex = accountIndex ?? get(selectedAccount)?.index
    const overview = await getParticipationOverview(_accountIndex)
    const participations = overview?.participations?.[proposalId] ?? {}
    const participationOutputs: TrackedParticipationOverview[] = Object.values(participations)
    return participationOutputs.some((output) => output?.endMilestoneIndex === 0)
}
