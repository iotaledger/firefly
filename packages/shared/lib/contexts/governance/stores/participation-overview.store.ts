import { get, writable } from 'svelte/store'

import { ParticipationOverview } from '@iota/wallet'

import { getParticipationOverview } from '@core/account/api'
import { selectedAccount } from '@core/account/stores'

import { DEFAULT_PARTICIPATION_OVERVIEW } from '../constants'

export const participationOverview = writable<ParticipationOverview>(DEFAULT_PARTICIPATION_OVERVIEW)

export async function updateParticipationOverview(): Promise<void> {
    const overview = await getParticipationOverview(get(selectedAccount))
    participationOverview.set(overview ?? DEFAULT_PARTICIPATION_OVERVIEW)
}

export function resetParticipationOverview(): void {
    participationOverview.set(DEFAULT_PARTICIPATION_OVERVIEW)
}
