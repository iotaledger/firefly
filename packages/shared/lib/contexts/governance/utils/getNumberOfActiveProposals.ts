import { get } from 'svelte/store'

import { ProposalStatus } from '../enums'
import { proposalsState } from '../stores'

import { isProposalActive } from './isProposalActive'

export function getNumberOfActiveProposals(): number {
    return Object.values(get(proposalsState)).filter((proposalStatus) =>
        isProposalActive(<ProposalStatus>proposalStatus?.status)
    ).length
}
