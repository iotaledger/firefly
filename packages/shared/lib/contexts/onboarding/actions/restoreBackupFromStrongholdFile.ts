import { get } from 'svelte/store'

import { restoreBackup } from '@core/profile-manager'

import { onboardingProfile, updateOnboardingProfile } from '../stores'

export async function restoreBackupFromStrongholdFile(strongholdPassword: string): Promise<void> {
    const { importFilePath } = get(onboardingProfile)
    await restoreBackup(importFilePath, strongholdPassword)
    updateOnboardingProfile({ lastStrongholdBackupTime: new Date() })
}
