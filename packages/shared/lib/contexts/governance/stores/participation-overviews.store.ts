import { derived, get, Readable, writable } from 'svelte/store'
import type { ParticipationOverview } from '@iota/sdk/out/types'
import { DEFAULT_PARTICIPATION_OVERVIEW } from '../constants'
import { getParticipationOverview } from '@core/wallet/actions'
import { selectedWalletId } from '@core/wallet/stores/selected-wallet-id.store'

export const allParticipationOverviews = writable<{ [walletId: string]: ParticipationOverview }>({})
let isUpdatingParticipationOverview: boolean = false

// TODO(2.0) Rename this store
export const participationOverviewForSelectedWallet: Readable<ParticipationOverview> = derived(
    [selectedWalletId, allParticipationOverviews],
    ([$selectedWalletId, $allParticipationOverviews]) => {
        $allParticipationOverviews[$selectedWalletId]
    }
)

export async function updateParticipationOverview(walletId: string = get(selectedWalletId)): Promise<void> {
    if (!isUpdatingParticipationOverview) {
        isUpdatingParticipationOverview = true
        const overview = await getParticipationOverview(walletId)
        isUpdatingParticipationOverview = false
        allParticipationOverviews.update((state) => {
            state[walletId] = overview ?? DEFAULT_PARTICIPATION_OVERVIEW
            return state
        })
    }
}

export async function updateParticipationOverviewForEventId(eventId: string): Promise<void> {
    const walletId = get(selectedWalletId)
    const overview = await getParticipationOverview(walletId, eventId)
    allParticipationOverviews.update((state) => {
        if (!state[walletId]) {
            state[walletId] = { participations: {} }
        }
        state[walletId].participations[eventId] = overview.participations[eventId]
        return state
    })
}

export function resetProposalOverviews(): void {
    allParticipationOverviews.set({})
}
