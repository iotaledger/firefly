import { get } from 'svelte/store'

import { getParticipationOverview } from '@core/account/api'
import { selectedAccount } from '@core/account/stores'

export async function getTotalNumberOfProposals(): Promise<number> {
    const overview = await getParticipationOverview(get(selectedAccount)?.index)
    return Object.keys(overview?.participations ?? {}).length
}
