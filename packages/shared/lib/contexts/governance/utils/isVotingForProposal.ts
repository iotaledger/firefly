import { get } from 'svelte/store'

import { TrackedParticipationOverview } from '@iota/wallet'

import { getParticipationOverview } from '@core/account/api'
import { selectedAccount } from '@core/account/stores'

export async function isVotingForProposal(proposalId: string): Promise<boolean> {
    const overview = await getParticipationOverview(get(selectedAccount)?.index)
    if (overview) {
        if (proposalId in overview.participations) {
            const participationOutputs: TrackedParticipationOverview[] = Object.values(
                overview.participations[proposalId]
            )
            return participationOutputs.some((output) => output?.endMilestoneIndex === 0)
        } else {
            return false
        }
    } else {
        return false
    }
}
