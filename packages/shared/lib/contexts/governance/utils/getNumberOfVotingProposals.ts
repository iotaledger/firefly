import { get } from 'svelte/store'

import { getParticipationOverview } from '@core/account/api'
import { selectedAccount } from '@core/account/stores'

import { isVotingForProposal } from './isVotingForProposal'

export async function getNumberOfVotingProposals(): Promise<number> {
    const overview = await getParticipationOverview(get(selectedAccount)?.index)
    return Object.keys(overview?.participations).filter((proposalId) => isVotingForProposal(proposalId)).length
}
