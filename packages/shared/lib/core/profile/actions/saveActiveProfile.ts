import { get } from 'svelte/store'
import { IPersistedProfile } from '../interfaces'
import { activeProfile, saveProfile } from '../stores'

export function saveActiveProfile(): void {
    const _activeProfile = get(activeProfile)
    if (_activeProfile?.id) {
        const profileToPersist: IPersistedProfile = {
            id: _activeProfile.id,
            name: _activeProfile.name,
            type: _activeProfile.type,
            networkProtocol: _activeProfile.networkProtocol,
            networkType: _activeProfile.networkType,
            lastStrongholdBackupTime: _activeProfile.lastStrongholdBackupTime,
            settings: _activeProfile.settings,
            isDeveloperProfile: _activeProfile.isDeveloperProfile,
            ...(_activeProfile.hiddenAccounts && { hiddenAccounts: _activeProfile.hiddenAccounts }),
            ...(_activeProfile.hasVisitedDashboard && { hasVisitedDashboard: _activeProfile.hasVisitedDashboard }),
            ...(_activeProfile.lastUsedAccountId && { lastUsedAccountId: _activeProfile.lastUsedAccountId }),
            ...(_activeProfile.accountMetadata && { accountMetadata: _activeProfile.accountMetadata }),
            ...(_activeProfile.hasFinishedSingleAccountGuide && {
                hasFinishedSingleAccountGuide: _activeProfile.hasFinishedSingleAccountGuide,
            }),
        }
        saveProfile(profileToPersist)
    }
}
