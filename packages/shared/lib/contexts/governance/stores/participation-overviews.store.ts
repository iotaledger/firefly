import { derived, get, Readable, writable } from 'svelte/store'
import type { ParticipationOverview } from '@iota/wallet/out/types'
import { selectedAccountIndex } from '@core/account/stores'
import { getParticipationOverview } from '@core/account/api/getParticipationOverview'
import { DEFAULT_PARTICIPATION_OVERVIEW } from '../constants'

export const allParticipationOverviews = writable<{ [accountId: number]: ParticipationOverview }>({})
let isUpdatingParticipationOverview: boolean = false

export const participationOverviewForSelectedAccount: Readable<ParticipationOverview> = derived(
    [selectedAccountIndex, allParticipationOverviews],
    ([$selectedAccountIndex, $allParticipationOverviews]) => {
        if ($selectedAccountIndex >= 0) {
            return $allParticipationOverviews[$selectedAccountIndex]
        } else {
            return undefined
        }
    }
)

export async function updateParticipationOverview(accountIndex: number = get(selectedAccountIndex)): Promise<void> {
    if (!isUpdatingParticipationOverview) {
        isUpdatingParticipationOverview = true
        const overview = await getParticipationOverview(accountIndex)
        isUpdatingParticipationOverview = false
        allParticipationOverviews.update((state) => {
            state[accountIndex] = overview ?? DEFAULT_PARTICIPATION_OVERVIEW
            return state
        })
    }
}

export function resetProposalOverviews(): void {
    allParticipationOverviews.set({})
}
