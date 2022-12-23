import { get } from 'svelte/store'

import { TrackedParticipationOverview } from '@iota/wallet'

import { getParticipationOverview } from '@core/account/api'
import { selectedAccount } from '@core/account/stores'

export async function isVotingForProposal(proposalId: string, accountIndex?: number): Promise<boolean> {
    const _accountIndex = accountIndex ?? get(selectedAccount)?.index
    const overview = await getParticipationOverview(_accountIndex)
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
