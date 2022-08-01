import { cleanupOnboardingStores } from './cleanupOnboardingStores'
import { deleteOnboardingProfile } from './deleteOnboardingProfile'
import { destroyIotaProfileManager } from './destroyIotaProfileManager'

export async function cleanupOnboarding(deleteProfile: boolean = false): Promise<void> {
    cleanupOnboardingStores()
    await cleanupExtraProfileManagers()
    if (deleteProfile) {
        await deleteOnboardingProfile()
    }
}

async function cleanupExtraProfileManagers(): Promise<void> {
    await destroyIotaProfileManager()
}
