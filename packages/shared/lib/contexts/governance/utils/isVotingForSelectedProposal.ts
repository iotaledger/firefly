import { get } from 'svelte/store'
import { selectedProposalId } from '../stores'
import { isVotingForProposal } from './isVotingForProposal'

export function isVotingForSelectedProposal(): boolean {
    const proposalId = get(selectedProposalId)
    return isVotingForProposal(proposalId)
}
