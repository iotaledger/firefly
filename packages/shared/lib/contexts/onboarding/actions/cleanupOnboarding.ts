import { cleanupOnboardingStores } from './cleanupOnboardingStores'
import { deleteNewProfile } from './deleteNewProfile'
import { destroyIotaProfileManager } from './destroyIotaProfileManager'

export async function cleanupOnboarding(deleteProfile: boolean = false): Promise<void> {
    cleanupOnboardingStores()
    await cleanupExtraProfileManagers()
    if (deleteProfile) {
        await deleteNewProfile()
    }
}

async function cleanupExtraProfileManagers(): Promise<void> {
    await destroyIotaProfileManager()
}
