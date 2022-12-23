import { activeProfileId } from '@core/profile'
import { get } from 'svelte/store'
import { ProposalStatus } from '../enums'

import { proposalsState } from '../stores'

import { isProposalActive } from './isProposalActive'

export function getNumberOfActiveProposals(): number {
    const profileId = get(activeProfileId)
    return Object.values(get(proposalsState)?.[profileId]).filter((proposalStatus) =>
        isProposalActive(<ProposalStatus>proposalStatus?.status)
    ).length
}
