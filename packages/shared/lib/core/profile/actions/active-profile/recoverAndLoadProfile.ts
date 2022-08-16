import { loadProfile } from '@core/profile'
import { recoverAccounts } from '@core/profile-manager'

export async function recoverAndLoadProfile(accountGapLimit: number, addressGapLimit: number): Promise<void> {
    try {
        await recoverAccounts(accountGapLimit, addressGapLimit)
        await loadProfile()
    } catch (err) {
        console.error(err)
    }
}
