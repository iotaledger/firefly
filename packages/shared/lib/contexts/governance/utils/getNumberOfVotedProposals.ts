import { get } from 'svelte/store'
import { participationOverviewForSelectedWallet } from '../stores'

export function getNumberOfVotedProposals(): number {
    const overview = get(participationOverviewForSelectedWallet)
    if (!overview) {
        return undefined
    }
    return Object.keys(overview.participations).length
}
