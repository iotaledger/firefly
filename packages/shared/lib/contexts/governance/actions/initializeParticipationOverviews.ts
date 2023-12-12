import { activeWallets } from '@core/profile'
import { ParticipationOverview } from '@iota/sdk/out/types'
import { get } from 'svelte/store'
import { DEFAULT_PARTICIPATION_OVERVIEW } from '../constants'
import { allParticipationOverviews } from '../stores'

export async function initializeParticipationOverviews(): Promise<void> {
    const allOverviews: { [walletId: string]: ParticipationOverview } = {}

    for (const wallet of get(activeWallets)) {
        const overview = await wallet.getParticipationOverview()
        allOverviews[wallet.id] = overview ?? DEFAULT_PARTICIPATION_OVERVIEW
    }
    allParticipationOverviews.set(allOverviews)
}
