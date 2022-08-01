import { get } from 'svelte/store'

import { strongholdPassword, updateOnboardingProfile } from '@contexts/onboarding'
import { Platform } from '@lib/platform'
import { InvalidBackupDestinationError } from '@core/profile'
import { backup } from '@core/profile-manager'
import { getDefaultStrongholdName } from '@lib/utils'

/**
 * Creates an initial backup for a profile's Stronghold.
 */
export async function backupInitialStronghold(): Promise<void> {
    const strongholdBackupDestination = await Platform.getStrongholdBackupDestination(getDefaultStrongholdName())
    if (strongholdBackupDestination) {
        await backup(strongholdBackupDestination, get(strongholdPassword))
        updateOnboardingProfile({ lastStrongholdBackupTime: new Date() })
    } else {
        throw new InvalidBackupDestinationError()
    }
}
