import { loadAccounts } from '@core/profile'
import { recoverAccounts } from '@core/profile-manager'

export async function recoverAndloadAllAccounts(accountGapLimit: number, addressGapLimit: number): Promise<void> {
    try {
        await recoverAccounts(accountGapLimit, addressGapLimit)
        await loadAccounts()
    } catch (err) {
        console.error(err)
    }
}
