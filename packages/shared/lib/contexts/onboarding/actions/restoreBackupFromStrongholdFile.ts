import { get } from 'svelte/store'
import { copyStrongholdFileToProfileDirectory } from '../helpers'
import { onboardingProfile } from '../stores'

export async function restoreBackupFromStrongholdFile(): Promise<void> {
    const profile = get(onboardingProfile)
    if (profile) {
        const { id, importFilePath } = profile
        await copyStrongholdFileToProfileDirectory(id, importFilePath)
    }
}
