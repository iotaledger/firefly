import { activeProfileId } from '@core/profile/stores'
import { get } from 'svelte/store'

import { proposalStates } from '../stores'

export function getNumberOfTotalProposals(): number {
    const proposals = get(proposalStates)?.[get(activeProfileId)]
    return Object.keys(proposals ?? {}).length
}
