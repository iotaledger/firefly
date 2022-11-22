import { profileManager as _profileManager } from '@core/profile-manager'
import { getLedgerNanoStatus } from '@lib/core/profile-manager/api'

import { resetLedgerNanoStatus, updateLedgerNanoStatus } from '../stores'

export async function getAndUpdateLedgerNanoStatus(
    profileManager = _profileManager,
    forwardErrors = false
): Promise<void> {
    try {
        const ledgerNanoStatusResponse = await getLedgerNanoStatus(profileManager)
        updateLedgerNanoStatus(ledgerNanoStatusResponse)
    } catch (err) {
        resetLedgerNanoStatus()
        if (forwardErrors) {
            return Promise.reject(err)
        } else {
            console.error(err)
        }
    }
}
