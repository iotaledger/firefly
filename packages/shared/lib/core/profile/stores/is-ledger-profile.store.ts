import { derived, Readable } from 'svelte/store'
import { ProfileType } from '../enums'
import { activeProfile } from './active-profile.store'

export const isLedgerProfile: Readable<boolean> = derived(
    activeProfile,
    ($activeProfile) =>
        $activeProfile?.type === ProfileType.Ledger || $activeProfile?.type === ProfileType.LedgerSimulator
)
