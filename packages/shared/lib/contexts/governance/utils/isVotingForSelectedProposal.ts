import { get } from 'svelte/store'

import { selectedProposal } from '../stores'
import { isVotingForProposal } from './isVotingForProposal'
import type { IAccountState } from '@core/account/interfaces'

export async function isVotingForSelectedProposal(account?: IAccountState): Promise<boolean> {
    const proposalId = get(selectedProposal)?.id
    return isVotingForProposal(proposalId, account)
}
