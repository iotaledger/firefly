import { get } from 'svelte/store'
import { registeredProposalsForSelectedWallet } from '../stores'

export function getNumberOfTotalProposals(): number {
    const proposals = get(registeredProposalsForSelectedWallet)
    return Object.keys(proposals ?? {}).length
}
