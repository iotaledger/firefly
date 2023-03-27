import { SECONDS_PER_MINUTE } from '@core/utils'
import { derived, get } from 'svelte/store'
import { activeProfile } from './active-profile.store'
import { isSoftwareProfile } from './is-software-profile.store'
import { timeSinceStrongholdUnlocked } from './timeSinceStrongholdUnlocked.store'

export const hasStrongholdLocked = derived(timeSinceStrongholdUnlocked, ($timeSinceStrongholdUnlocked) => {
    const { strongholdPasswordTimeoutInMinutes } = get(activeProfile).settings
    const _isSoftwareProfile = get(isSoftwareProfile)
    return _isSoftwareProfile && strongholdPasswordTimeoutInMinutes
        ? $timeSinceStrongholdUnlocked > strongholdPasswordTimeoutInMinutes * SECONDS_PER_MINUTE
        : false
})
