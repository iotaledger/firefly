import { get } from 'svelte/store'

import { TrackedParticipationOverview } from '@iota/wallet'

import { getParticipationOverview } from '@core/account/api'
import { selectedAccount } from '@core/account/stores'

import { selectedProposal } from '../stores'

export async function isVotingForSelectedProposal(): Promise<boolean> {
    const overview = await getParticipationOverview(get(selectedAccount)?.index)
    if (overview) {
        const proposalId = get(selectedProposal)?.id
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
