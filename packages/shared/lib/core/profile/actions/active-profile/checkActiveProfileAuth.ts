import { checkOrConnectLedger } from '@core/ledger'
import { isActiveLedgerProfile, isSoftwareProfile } from '@core/profile'
import { checkOrUnlockStronghold } from '@core/stronghold'
import { get } from 'svelte/store'

export function checkActiveProfileAuth(
    callback: () => Promise<unknown> = async () => {},
    reopenPopup?: { stronghold?: boolean; ledger?: boolean },
    cancelledCallback?: () => unknown
): Promise<unknown> {
    if (get(isSoftwareProfile)) {
        return checkOrUnlockStronghold(callback, reopenPopup?.stronghold, cancelledCallback)
    } else if (get(isActiveLedgerProfile)) {
        return checkOrConnectLedger(callback, reopenPopup?.ledger, cancelledCallback)
    } else {
        return Promise.resolve()
    }
}
