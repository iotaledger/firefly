import { get } from 'svelte/store'

import { selectedProposal } from '../stores'
import { isVotingForProposal } from './isVotingForProposal'

import { isVotingForProposal } from './isVotingForProposal'

export async function isVotingForSelectedProposal(): Promise<boolean> {
    const proposalId = get(selectedProposal)?.id
    return isVotingForProposal(proposalId)
}
