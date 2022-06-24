import { importFilePath, profileRecoveryType } from '@contexts/onboarding'
import { deleteAccountsAndDatabase } from '@core/profile-manager'

export async function resetImportState(): Promise<void> {
    importFilePath.set(null)
    profileRecoveryType.set(null)
    // TODO: use new function exposed in next wallet.rs version
    await deleteAccountsAndDatabase()
}
