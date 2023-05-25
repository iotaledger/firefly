import { checkOrConnectLedger } from '@core/ledger'
import { isActiveLedgerProfile, isSoftwareProfile } from '@core/profile'
import { checkOrUnlockStronghold } from '@core/stronghold'
import { get } from 'svelte/store'

export function checkActiveProfileAuth(
    callback: () => Promise<unknown> = async () => {},
    reopenOverlay?: { stronghold?: boolean; ledger?: boolean }
): Promise<unknown> {
    if (get(isSoftwareProfile)) {
        return checkOrUnlockStronghold(callback, reopenOverlay?.stronghold)
    } else if (get(isActiveLedgerProfile)) {
        return checkOrConnectLedger(callback, reopenOverlay?.ledger)
    }
}
