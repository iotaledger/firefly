import { get } from 'svelte/store'

import { getParticipationOverview } from '@core/account/api'
import { selectedAccount } from '@core/account/stores'

import { isVotingForProposal } from './isVotingForProposal'

export async function getNumberOfVotingProposals(): Promise<number> {
    const { participations } = (await getParticipationOverview(get(selectedAccount)?.index)) ?? {}
    const votingProposals = Object.keys(participations ?? {}).filter((proposalId) => isVotingForProposal(proposalId))
    return votingProposals.length
}
