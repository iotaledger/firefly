import { get } from 'svelte/store'

import { participationOverviewForSelectedAccount } from '../stores'

import { isVotingForProposal } from './isVotingForProposal'

export function getNumberOfVotingProposals(): number {
    const overview = get(participationOverviewForSelectedAccount)
    if (!overview) {
        return undefined
    }
    const votingProposals = Object.keys(overview.participations).filter((proposalId) => isVotingForProposal(proposalId))
    return votingProposals.length
}
