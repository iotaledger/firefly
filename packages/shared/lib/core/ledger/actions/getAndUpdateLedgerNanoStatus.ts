import { Writable } from 'svelte/store'

import { IProfileManager, profileManager as _profileManager } from '@core/profile-manager'
import { getLedgerNanoStatus } from '@lib/core/profile-manager/api'

import { resetLedgerNanoStatus, updateLedgerNanoStatus } from '../stores'

export async function getAndUpdateLedgerNanoStatus(
    profileManager: Writable<IProfileManager> = _profileManager,
    forwardErrors = false
): Promise<void> {
    try {
        const ledgerNanoStatusResponse = await getLedgerNanoStatus(profileManager)
        updateLedgerNanoStatus(ledgerNanoStatusResponse)
    } catch (error) {
        resetLedgerNanoStatus()
        if (forwardErrors) {
            return Promise.reject(error)
        } else {
            console.error(error)
        }
    }
}
