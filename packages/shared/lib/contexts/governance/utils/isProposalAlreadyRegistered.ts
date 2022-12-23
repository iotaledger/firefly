import { get } from 'svelte/store'

import { proposalsState } from '../stores'
import { activeProfileId } from '@core/profile'

export function isProposalAlreadyRegistered(proposalId: string): boolean {
    return proposalId in get(proposalsState)?.[get(activeProfileId)]
}
