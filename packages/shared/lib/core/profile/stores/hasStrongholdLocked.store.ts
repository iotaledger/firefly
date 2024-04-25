import { SECONDS_PER_MINUTE } from '@core/utils'
import { derived, get } from 'svelte/store'
import { activeProfile } from './active-profile.store'
import { isSoftwareProfile } from './is-software-profile.store'
import { timeSinceStrongholdUnlocked } from './timeSinceStrongholdUnlocked.store'

export const hasStrongholdLocked = derived(timeSinceStrongholdUnlocked, ($timeSinceStrongholdUnlocked) => {
    const profile = get(activeProfile)
    if (!profile) {
        return true
    }
    const { strongholdPasswordTimeoutInMinutes } = profile.settings
    const _isSoftwareProfile = get(isSoftwareProfile)
    return _isSoftwareProfile && strongholdPasswordTimeoutInMinutes
        ? $timeSinceStrongholdUnlocked > strongholdPasswordTimeoutInMinutes * SECONDS_PER_MINUTE
        : false
})
