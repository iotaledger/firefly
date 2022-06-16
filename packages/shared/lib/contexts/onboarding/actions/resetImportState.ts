import { importFilePath, importType } from '@contexts/onboarding/stores'
import { deleteStorage } from '@core/profile-manager'

export async function resetImportState(): Promise<void> {
    importFilePath.set(null)
    importType.set(null)
    // TODO: use new function exposed in next wallet.rs version
    await deleteStorage()
}
