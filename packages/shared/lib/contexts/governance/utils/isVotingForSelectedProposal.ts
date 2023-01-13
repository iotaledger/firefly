import { get } from 'svelte/store'

import { selectedProposal } from '../stores'
import { isVotingForProposal } from './isVotingForProposal'

export function isVotingForSelectedProposal(accountIndex?: number): Promise<boolean> {
    const proposalId = get(selectedProposal)?.id
    return isVotingForProposal(proposalId, accountIndex)
}
