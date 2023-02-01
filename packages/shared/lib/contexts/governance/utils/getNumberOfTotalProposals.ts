import { get } from 'svelte/store'
import { registeredProposalsForSelectedAccount } from '../stores'

export function getNumberOfTotalProposals(): number {
    const proposals = get(registeredProposalsForSelectedAccount)
    return Object.keys(proposals ?? {}).length
}
