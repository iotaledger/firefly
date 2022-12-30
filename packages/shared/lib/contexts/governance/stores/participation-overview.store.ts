import { get, writable } from 'svelte/store'

import { ParticipationOverview } from '@iota/wallet'

export const participationOverview = writable<ParticipationOverview>({ participations: {} })

export function updateParticipationOverview(payload: Partial<ParticipationOverview>): void {
    const _participationOverview = get(participationOverview)
    participationOverview.set({ ..._participationOverview, ...payload })
}
