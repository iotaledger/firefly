import { get } from 'svelte/store'

import { TrackedParticipationOverview } from '@iota/wallet'

import { getParticipationOverview } from '@core/account/api'
import { selectedAccount } from '@core/account/stores'

import { selectedProposal } from '../stores'

export async function isVotingForProposal(): Promise<boolean> {
    const overview = await getParticipationOverview(get(selectedAccount)?.index ?? 0)
    if (overview) {
        const proposalId = get(selectedProposal)?.id
        if (proposalId in overview.participations) {
            const participationOutputs: TrackedParticipationOverview[] = Object.values(
                overview.participations[proposalId]
            )
            return participationOutputs.some((output) => output?.endMilestoneIndex === 0)
        } else {
            throw new Error('Unable to retrieve selected proposal in participation overview.')
        }
    } else {
        throw new Error('Unable to retrieve participation overview.')
    }
}
