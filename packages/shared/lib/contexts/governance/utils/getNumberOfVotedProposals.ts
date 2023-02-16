import { get } from 'svelte/store'
import { participationOverviewForSelectedAccount } from '../stores'

export function getNumberOfVotedProposals(): number {
    const overview = get(participationOverviewForSelectedAccount)
    if (!overview) {
        return undefined
    }
    return Object.keys(overview.participations).length
}
