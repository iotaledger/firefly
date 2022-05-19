import { activeProfile, IPersistedProfile, loadPersistedProfileIntoActiveProfile, saveProfile } from '@core/profile'
import { get } from 'svelte/store'

export function saveActiveProfile(): void {
    const _activeProfile = get(activeProfile)
    if (_activeProfile?.id) {
        // activeProfile contains more properties that IPersistedProfile
        // so we need to destructure only the properties that we want to persist
        const profileToPersist: IPersistedProfile = {
            id: _activeProfile?.id,
            name: _activeProfile?.name,
            type: _activeProfile?.type,
            networkProtocol: _activeProfile?.networkProtocol,
            networkType: _activeProfile?.networkType,
            lastStrongholdBackupTime: _activeProfile?.lastStrongholdBackupTime,
            settings: _activeProfile?.settings,
            isDeveloperProfile: _activeProfile?.isDeveloperProfile,
            ...(_activeProfile?.hasVisitedDashboard && { hasVisitedDashboard: _activeProfile?.hasVisitedDashboard }),
            ...(_activeProfile?.lastUsedAccountId && { lastUsedAccountId: _activeProfile?.lastUsedAccountId }),
            ...(_activeProfile?.accountMetadata && { accountMetadata: _activeProfile?.accountMetadata }),
            ...(_activeProfile?.hasFinishedSingleAccountGuide && {
                hasFinishedSingleAccountGuide: _activeProfile?.hasFinishedSingleAccountGuide,
            }),
        }
        saveProfile(profileToPersist)
    }
}
