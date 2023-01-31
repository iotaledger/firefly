import { get } from 'svelte/store'

import { proposalStates } from '../stores'
import { activeProfileId } from '@core/profile'

export function isProposalAlreadyAdded(proposalId: string): boolean {
    return proposalId in get(proposalStates)?.[get(activeProfileId)]
}
