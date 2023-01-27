import { get } from 'svelte/store'
import { ProposalStatus } from '../enums'
import { proposalStates } from '../stores'
import { isProposalActive } from './isProposalActive'

export function getNumberOfActiveProposals(): number {
    const proposals = get(proposalStates)
    const activeProposals = Object.values(proposals ?? {}).filter(({ state }) =>
        isProposalActive(<ProposalStatus>state?.status)
    )
    return activeProposals.length
}
