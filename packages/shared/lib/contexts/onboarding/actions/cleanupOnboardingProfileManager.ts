import { clearProfileFromMemory, removeProfileFolder } from '@core/profile'
import { getSelectedWallet } from 'shared/lib/core/wallet'

// TODO(2.0) Fix all usages and rename
export async function cleanupOnboardingProfileManager(): Promise<void> {
    if (!getSelectedWallet()) {
        return
    }

    const { id } = getSelectedWallet()

    await clearProfileFromMemory()
    await removeProfileFolder(id)
}
