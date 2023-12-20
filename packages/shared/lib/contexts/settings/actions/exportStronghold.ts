import { updateActiveProfile } from '@core/profile'
import { Platform } from '@core/app'
import { getDefaultStrongholdName } from '@core/stronghold'
import { backup } from '@core/wallet/actions'

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
