import { get } from 'svelte/store'

import { participationOverviewForSelectedAccount } from '../stores'

import { isVotingForProposal } from './isVotingForProposal'

export function getNumberOfVotingProposals(): number {
    const { participations } = get(participationOverviewForSelectedAccount)
    const votingProposals = Object.keys(participations).filter((proposalId) => isVotingForProposal(proposalId))
    return votingProposals.length
}
