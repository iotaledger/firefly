import { get } from 'svelte/store'
import { localize } from '@core/i18n'
import { getDefaultClientOptions, NetworkProtocol, NetworkType } from '@core/network'
import { showAppNotification } from '@lib/notifications'
import { createNewProfile, getStorageDirectoryOfProfile, newProfile, validateProfileName } from '@core/profile'
import { destroyProfileManager, initialiseProfileManager } from '@core/profile-manager'

export async function initializeProfile(name: string): Promise<void> {
    try {
        const trimmedProfileName = name.trim()
        validateProfileName(trimmedProfileName)

        let _newProfile = get(newProfile)
        if (!_newProfile) return

        if (_newProfile.id) destroyProfileManager()

        // TODO: set network based on user selection
        await createNewProfile(_newProfile.isDeveloperProfile, NetworkProtocol.Shimmer, NetworkType.Devnet)
        _newProfile = get(newProfile)

        const path = await getStorageDirectoryOfProfile(_newProfile.id)
        const clientOptions = getDefaultClientOptions(NetworkProtocol.Shimmer, NetworkType.Devnet)
        // const machineId = await Platform.getMachineId()
        // const { sendCrashReports } = $initAppSettings ?? { sendCrashReports: false }
        initialiseProfileManager(path, clientOptions, {
            Stronghold: { password: '', snapshotPath: `${path}/wallet.stronghold` },
        })
        // initialiseMigrationListeners()
    } catch (err) {
        showAppNotification({
            type: 'error',
            message: localize(err.error ? err.error : 'error.global.generic'),
        })
    }
}
