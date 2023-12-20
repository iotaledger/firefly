import { get } from 'svelte/store'

import { participationOverviewForSelectedWallet } from '../stores'

import { isVotingForProposal } from './isVotingForProposal'

export function getNumberOfVotingProposals(): number {
    const overview = get(participationOverviewForSelectedWallet)
    if (!overview) {
        return undefined
    }
    const votingProposals = Object.keys(overview.participations).filter((proposalId) => isVotingForProposal(proposalId))
    return votingProposals.length
}
