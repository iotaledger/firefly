import { get } from 'svelte/store'

import { selectedProposalId } from '../stores'
import { isVotingForProposal } from './isVotingForProposal'
import { selectedWalletId } from '@core/wallet'

export function isVotingForSelectedProposal(walletId = get(selectedWalletId)): boolean {
    const proposalId = get(selectedProposalId)
    return isVotingForProposal(proposalId, walletId)
}
