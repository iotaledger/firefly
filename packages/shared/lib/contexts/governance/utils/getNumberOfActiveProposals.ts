import { activeProfileId } from '@core/profile'
import { get } from 'svelte/store'
import { ProposalStatus } from '../enums'

import { proposalsState } from '../stores'

import { isProposalActive } from './isProposalActive'

export function getNumberOfActiveProposals(): number {
    const proposals = get(proposalsState)?.[get(activeProfileId)]
    const activeProposals = Object.values(proposals ?? {}).filter(({ state }) =>
        isProposalActive(<ProposalStatus>state?.status)
    )
    return activeProposals.length
}
