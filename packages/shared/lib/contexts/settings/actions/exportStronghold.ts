import { updateActiveProfile } from '@core/profile'
import { backup, setStrongholdPassword } from '@core/profile-manager'
import { Platform } from '@core/app'
import { getDefaultStrongholdName } from '@core/stronghold'

export async function exportStronghold(
    password: string,
    callback?: (cancelled: boolean, error?: string) => void
): Promise<void> {
    try {
        const destination = await Platform.getStrongholdBackupDestination(getDefaultStrongholdName())
        if (destination) {
            try {
                Platform.saveStrongholdBackup({ allowAccess: true })
                await setStrongholdPassword(password)
                await backup(destination, password)
                Platform.saveStrongholdBackup({ allowAccess: false })
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
