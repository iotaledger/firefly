import { get } from 'svelte/store'
import { registeredProposalsForSelectedWallet } from '../stores'

export function isProposalAlreadyAddedForSelectedWallet(proposalId: string): boolean {
    return !!get(registeredProposalsForSelectedWallet)?.[proposalId]
}
