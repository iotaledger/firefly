import { activeProfileId } from '@core/profile'
import { get } from 'svelte/store'
import { ProposalStatus } from '../enums'

import { proposalsState } from '../stores'

import { isProposalActive } from './isProposalActive'

export function getNumberOfActiveProposals(): number {
    const proposals = get(proposalsState)?.[get(activeProfileId)]
    const activeProposals = Object.values(proposals ?? {}).filter((proposalStatus) =>
        isProposalActive(<ProposalStatus>proposalStatus?.status)
    )
    return activeProposals.length
}
