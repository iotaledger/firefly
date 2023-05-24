import { isNftOwnedByAnyAccount } from '@core/nfts/utils'
import { activeProfile, updateActiveProfile } from '@core/profile/stores'
import { get } from 'svelte/store'

export function checkAndRemoveProfilePicture(): void {
    const _activeProfile = get(activeProfile)
    if (_activeProfile.pfp) {
        const isProfilePictureStillOwned = isNftOwnedByAnyAccount(_activeProfile.pfp.id)
        if (!isProfilePictureStillOwned) {
            updateActiveProfile({ pfp: undefined })
        }
    }
}
