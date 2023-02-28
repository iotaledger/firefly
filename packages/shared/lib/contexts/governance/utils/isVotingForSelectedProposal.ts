import { get } from 'svelte/store'

import { selectedProposalId } from '../stores'
import { isVotingForProposal } from './isVotingForProposal'

export function isVotingForSelectedProposal(accountIndex?: number): boolean {
    const proposalId = get(selectedProposalId)
    return isVotingForProposal(proposalId, accountIndex)
}
