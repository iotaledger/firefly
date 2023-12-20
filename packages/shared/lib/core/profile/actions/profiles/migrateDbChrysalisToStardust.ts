import { logAndNotifyError } from '@core/error/actions'
import { updateProfile } from '@core/profile/stores'
import { getStorageDirectoryOfProfile } from '@core/profile/utils'
import { api } from '@core/api'

/**
 * Updates the profile underlying DB from chrysalis model to stardust.
 * @param profileId The profile that needs migration.
 * @param pinCode The pin to use.
 * @returns A boolean indicating the migration outcome.
 */
export async function migrateDbChrysalisToStardust(profileId: string, pinCode: string): Promise<boolean> {
    const profileDirectory = await getStorageDirectoryOfProfile(profileId)
    const response = await api.migrateDbChrysalisToStardust(profileDirectory, pinCode)

    if (response instanceof Error) {
        updateProfile(profileId, { needsChrysalisToStardustDbMigration: true })
        let reason = ''

        try {
            reason = JSON.parse(response.message).payload?.error
        } finally {
            logAndNotifyError({
                type: 'wallet',
                message: `Chrysalis database migration failed: ${reason}`,
                saveToErrorLog: true,
                showNotification: true,
                originalError: response,
            })
        }

        return false
    } else {
        updateProfile(profileId, { needsChrysalisToStardustDbMigration: undefined })
        return true
    }
}
