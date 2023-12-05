import { get } from 'svelte/store'
import { registeredProposalsForSelectedWallet } from '../stores'
import { isProposalActive } from './isProposalActive'

export function getNumberOfActiveProposals(): number {
    const proposals = get(registeredProposalsForSelectedWallet)
    const activeProposals = Object.values(proposals ?? {}).filter((proposal) => isProposalActive(proposal?.status))
    return activeProposals.length
}
