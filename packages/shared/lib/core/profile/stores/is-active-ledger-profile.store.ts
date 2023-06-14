import { derived, get, Readable } from 'svelte/store'

import { isLedgerProfile } from '../utils'

import { activeProfile } from './active-profile.store'

export const isActiveLedgerProfile: Readable<boolean> = derived(activeProfile, ($activeProfile) =>
    isLedgerProfile($activeProfile?.type)
)

export function getIsActiveLedgerProfile(): boolean {
    return get(isActiveLedgerProfile)
}
