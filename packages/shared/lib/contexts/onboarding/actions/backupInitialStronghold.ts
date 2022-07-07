import { get } from 'svelte/store'

import { strongholdPassword, updateNewProfile } from '@contexts/onboarding'
import { Platform } from '@lib/platform'
import { backup } from '@core/profile-manager'
import { getDefaultStrongholdName } from '@lib/utils'
import { InvalidBackupDestinationError } from '@core/error'

/**
 * Creates an initial backup for a profile's Stronghold.
 */
export async function backupInitialStronghold(): Promise<void> {
    const strongholdBackupDestination = await Platform.getStrongholdBackupDestination(getDefaultStrongholdName())
    if (strongholdBackupDestination) {
        await backup(strongholdBackupDestination, get(strongholdPassword))
        updateNewProfile({ lastStrongholdBackupTime: new Date() })
    } else {
        throw new InvalidBackupDestinationError()
    }
}
