import { activeProfileId } from '@core/profile/stores'
import { get } from 'svelte/store'

import { proposalsState } from '../stores'

export function getNumberOfTotalProposals(): number {
    const proposals = get(proposalsState)?.[get(activeProfileId)]
    return Object.keys(proposals ?? {}).length
}
