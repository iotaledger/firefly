import { get } from 'svelte/store'

import { proposalsState } from '../stores'

export function isProposalAlreadyRegistered(proposalId: string): boolean {
    return proposalId in get(proposalsState)
}
