import { get } from 'svelte/store'

import { participationOverview } from '../stores'

import { isVotingForProposal } from './isVotingForProposal'

export function getNumberOfVotingProposals(): number {
    const { participations } = get(participationOverview)
    const votingProposals = Object.keys(participations ?? {}).filter((proposalId) => isVotingForProposal(proposalId))
    return votingProposals.length
}
