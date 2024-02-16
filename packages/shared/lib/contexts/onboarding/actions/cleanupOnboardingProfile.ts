import { clearProfileFromMemory, removeProfileFolder } from '@core/profile'
import { getSelectedWallet } from '@core/wallet'

export async function cleanupOnboardingProfile(): Promise<void> {
    if (!getSelectedWallet()) {
        return
    }

    const { id } = getSelectedWallet()

    await clearProfileFromMemory()
    await removeProfileFolder(id)
}
