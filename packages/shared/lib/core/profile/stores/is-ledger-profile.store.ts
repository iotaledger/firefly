import { derived, Readable } from 'svelte/store'

import { ProfileType } from '../enums'
import { activeProfile } from './active-profile.store'

export const isLedgerProfile: Readable<boolean> = derived(activeProfile, ($activeProfile) =>
    isLedgerProfileHelper($activeProfile?.type)
)

export function isLedgerProfileHelper(profileType: ProfileType): boolean {
    return profileType === ProfileType.Ledger
}
