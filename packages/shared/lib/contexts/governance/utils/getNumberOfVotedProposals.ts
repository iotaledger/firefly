import { get } from 'svelte/store'
import { participationOverviewForSelectedAccount } from '../stores'

export function getNumberOfVotedProposals(): number {
    const { participations } = get(participationOverviewForSelectedAccount)
    return Object.keys(participations).length
}
