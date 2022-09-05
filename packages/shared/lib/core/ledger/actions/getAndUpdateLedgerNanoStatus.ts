import { getLedgerNanoStatus } from '@lib/core/profile-manager/api'
import { resetLedgerNanoStatus, updateLedgerNanoStatus } from '../stores'

export async function getAndUpdateLedgerNanoStatus(forwardErrors = false): Promise<void> {
    try {
        const ledgerNanoStatusResponse = await getLedgerNanoStatus()
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
