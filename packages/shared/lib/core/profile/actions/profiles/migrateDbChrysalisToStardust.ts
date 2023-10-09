import { logAndNotifyError } from '@core/error/actions'
import { api } from '@core/profile-manager'
import { updateProfile } from '@core/profile/stores'
import { getStorageDirectoryOfProfile } from '@core/profile/utils'

const ATTEMPT_MIGRATION_CHRYSALIS_TO_STARUDST_ERROR = 'migration failed no chrysalis data to migrate'

/**
 * Updates the profile underlying DB from chrysalis model to stardust.
 * @param profileId The profile that needs migration.
 * @param pinCode The pin to use.
 * @returns A boolean indicating the migration outcome.
 */
export async function migrateDbChrysalisToStardust(profileId: string, pinCode: string): Promise<boolean> {
    const profileDirectory = await getStorageDirectoryOfProfile(profileId)
    const response = await api.migrateDbChrysalisToStardust(profileDirectory, pinCode)

    const _onSuccess = (): void => {
        updateProfile(profileId, { needsChrysalisToStardustDbMigration: undefined })
    }

    if (response instanceof Error) {
        updateProfile(profileId, { needsChrysalisToStardustDbMigration: true })
        let reason = ''
        let success = false

        try {
            reason = JSON.parse(response.message).payload?.error

            // The 'no chrysalis data to migrate' error only happens when entering a Stardust profile
            // that the wallet got migrated (hence the error) but the profile didn't, we can safely skip this error.
            if (reason === ATTEMPT_MIGRATION_CHRYSALIS_TO_STARUDST_ERROR) {
                success = true
            }
        } finally {
            if (!success) {
                logAndNotifyError({
                    type: 'wallet',
                    message: `Chrysalis database migration failed: ${reason}`,
                    saveToErrorLog: true,
                    showNotification: true,
                    originalError: response,
                })
            }
        }
        _onSuccess()
        return success
    } else {
        _onSuccess()
        return true
    }
}
