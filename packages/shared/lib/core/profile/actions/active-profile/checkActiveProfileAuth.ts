import { checkLedgerConnection } from '@core/ledger'
import { isActiveLedgerProfile, isSoftwareProfile } from '@core/profile'
import { checkStronghold } from '@lib/stronghold'
import { get } from 'svelte/store'

export function checkActiveProfileAuth(
    callback: () => Promise<unknown> = async () => {},
    reopenPopup?: { stronghold?: boolean; ledger?: boolean }
): Promise<unknown> {
    if (get(isSoftwareProfile)) {
        return checkStronghold(callback, reopenPopup?.stronghold)
    } else if (get(isActiveLedgerProfile)) {
        return checkLedgerConnection(callback, reopenPopup?.ledger)
    }
}
