import { Writable } from 'svelte/store'

import { IProfileManager, profileManager as _profileManager } from '@core/profile-manager'
import { getLedgerNanoStatus } from '@lib/core/profile-manager/api'

import { resetLedgerNanoStatus, updateLedgerNanoStatus } from '../stores'

export async function getAndUpdateLedgerNanoStatus(
    forwardErrors = false,
    profileManager: Writable<IProfileManager> = _profileManager
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
