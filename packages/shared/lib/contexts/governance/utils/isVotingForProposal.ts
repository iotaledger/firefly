import { get } from 'svelte/store'
import { getParticipationOverview } from '@core/account/api'
import { selectedAccount } from '@core/account/stores'
import { TrackedParticipationOverview } from '@iota/wallet'

export async function isVotingForProposal(proposalId: string): Promise<boolean> {
    const overview = await getParticipationOverview(get(selectedAccount)?.index)
    const participations = overview?.participations?.[proposalId]
    if (participations) {
        const participationOutputs: TrackedParticipationOverview[] = Object.values(participations)
        return participationOutputs.some((output) => output?.endMilestoneIndex === 0)
    } else {
        return false
    }
}
