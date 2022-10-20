import { updateActiveProfile } from '@core/profile'
import { backup } from '@core/profile-manager'
import { Platform } from '@lib/platform'
import { getDefaultStrongholdName } from '@core/stronghold'

export async function exportStronghold(
    password: string,
    callback?: (cancelled: boolean, error?: string) => void
): Promise<void> {
    try {
        const destination = await Platform.getStrongholdBackupDestination(getDefaultStrongholdName())
        if (destination) {
            try {
                await backup(destination, password)
                updateActiveProfile({ lastStrongholdBackupTime: new Date() })
                callback(false)
            } catch (err) {
                callback(false, err.error)
            }
        } else {
            callback(true)
        }
    } catch (err) {
        callback(false, err.error)
    }
}
