import { get } from 'svelte/store'
import { proposalStates } from '../stores'
import { isProposalActive } from './isProposalActive'

export function getNumberOfActiveProposals(): number {
    const proposals = get(proposalStates)
    const activeProposals = Object.values(proposals ?? {}).filter((proposalState) =>
        isProposalActive(proposalState?.state?.status)
    )
    return activeProposals.length
}
