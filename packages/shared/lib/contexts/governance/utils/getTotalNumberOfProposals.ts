import { get } from 'svelte/store'

import { participationOverview } from '../stores'

export function getTotalNumberOfProposals(): number {
    const { participations } = get(participationOverview)
    return Object.keys(participations ?? {}).length
}
