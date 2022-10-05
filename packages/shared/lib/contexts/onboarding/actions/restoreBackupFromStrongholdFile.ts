import { get } from 'svelte/store'

import { profileManager, restoreBackup } from '@core/profile-manager'

import { onboardingProfile, updateOnboardingProfile } from '../stores'
import { validateStrongholdCoinType } from '../helpers'

export async function restoreBackupFromStrongholdFile(strongholdPassword: string): Promise<void> {
    const { importFilePath, networkProtocol } = get(onboardingProfile)
    await restoreBackup(importFilePath, strongholdPassword)

    /**
     * NOTE: We must check that the Stronghold file's coin_type matches the current networkProtocol
     * and is not based on an alternate protocol.
     */
    await validateStrongholdCoinType(profileManager, networkProtocol)

    updateOnboardingProfile({ lastStrongholdBackupTime: new Date() })
}
