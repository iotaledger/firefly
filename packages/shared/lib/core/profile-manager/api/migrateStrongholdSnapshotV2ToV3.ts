import { get } from 'svelte/store'

import { profileManager } from '../stores'

export async function migrateStrongholdSnapshotV2ToV3(
    currentPath: string,
    currentPassword: string,
    newPath: string,
    newPassword: string
): Promise<void> {
    const manager = get(profileManager)
    await manager.migrateStrongholdSnapshotV2ToV3(currentPath, currentPassword, newPath, newPassword)
}
