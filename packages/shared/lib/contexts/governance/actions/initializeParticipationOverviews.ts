import { activeAccounts } from '@core/profile'
import { ParticipationOverview } from '@iota/wallet/out/types'
import { get } from 'svelte/store'
import { DEFAULT_PARTICIPATION_OVERVIEW } from '../constants'
import { allParticipationOverviews } from '../stores'

export async function initializeParticipationOverviews(): Promise<void> {
    const allOverviews: { [accountId: number]: ParticipationOverview } = {}

    for (const account of get(activeAccounts)) {
        const overview = await account.getParticipationOverview()
        allOverviews[account.index] = overview ?? DEFAULT_PARTICIPATION_OVERVIEW
    }
    allParticipationOverviews.set(allOverviews)
}
