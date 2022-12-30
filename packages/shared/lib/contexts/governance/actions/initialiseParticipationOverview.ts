import { get } from 'svelte/store'

import { getParticipationOverview } from '@core/account/api'
import { selectedAccountIndex } from '@core/account/stores'

import { updateParticipationOverview } from '../stores'

export async function initialiseParticipationOverview(): Promise<void> {
    const overview = await getParticipationOverview(get(selectedAccountIndex))
    updateParticipationOverview(overview)
}
