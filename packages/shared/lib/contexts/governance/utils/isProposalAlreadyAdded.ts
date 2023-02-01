import { get } from 'svelte/store'
import { proposalStates } from '../stores'

export function isProposalAlreadyAdded(proposalId: string): boolean {
    return proposalId in get(proposalStates)
}
