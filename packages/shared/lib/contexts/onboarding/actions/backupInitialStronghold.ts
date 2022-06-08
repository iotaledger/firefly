import { get } from 'svelte/store'

import { strongholdPassword } from '@lib/app'
import { Platform } from '@lib/platform'
import { updateNewProfile } from '@core/profile'
import { backup } from '@core/profile-manager'
import { getDefaultStrongholdName } from '@lib/utils'

/**
 * Creates an initial backup for a profile's Stronghold.
 */
export async function backupInitialStronghold(): Promise<void> {
    const strongholdBackupDestination = await Platform.getStrongholdBackupDestination(getDefaultStrongholdName())
    if (strongholdBackupDestination) {
        await backup(strongholdBackupDestination, get(strongholdPassword))
        updateNewProfile({ lastStrongholdBackupTime: new Date() })
    }
}
