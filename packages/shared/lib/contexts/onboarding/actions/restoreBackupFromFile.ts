import { get } from 'svelte/store'

import { restoreBackup } from '@core/profile-manager'

import { onboardingProfile } from '../stores'

export async function restoreBackupFromFile(backupFile: Buffer, password: string): Promise<void> {
    await restoreBackup(get(onboardingProfile)?.importFilePath, password)
    get(onboardingProfile).lastStrongholdBackupTime = new Date()
}
