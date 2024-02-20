import { getLedgerNanoStatus } from '@core/secret-manager'
import { SecretManager } from '@iota/sdk'
import { resetLedgerNanoStatus, updateLedgerNanoStatus } from '../stores'

export async function getAndUpdateLedgerNanoStatus(secretManager?: SecretManager, forwardErrors = false): Promise<void> {
    try {
        const ledgerNanoStatusResponse = await getLedgerNanoStatus(secretManager)
        console.log(ledgerNanoStatusResponse)
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
