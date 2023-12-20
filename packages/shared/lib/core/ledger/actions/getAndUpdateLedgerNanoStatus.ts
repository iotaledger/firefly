import { resetLedgerNanoStatus, updateLedgerNanoStatus } from '../stores'

// TODO(2.0) Fix this, profile manager is gone
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
