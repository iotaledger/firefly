import { get } from 'svelte/store'
import { registeredProposalsForSelectedAccount } from '../stores'
import { isProposalActive } from './isProposalActive'

export function getNumberOfActiveProposals(): number {
    const proposals = get(registeredProposalsForSelectedAccount)
    const activeProposals = Object.values(proposals ?? {}).filter((proposal) => isProposalActive(proposal?.status))
    return activeProposals.length
}
