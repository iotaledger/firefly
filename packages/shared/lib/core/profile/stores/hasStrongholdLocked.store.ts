import { derived, get } from 'svelte/store'

import { STRONGHOLD_PASSWORD_CLEAR_INTERVAL } from '../constants'

import { isSoftwareProfile } from './is-software-profile.store'
import { timeSinceStrongholdUnlocked } from './timeSinceStrongholdUnlocked.store'

export const hasStrongholdLocked = derived(timeSinceStrongholdUnlocked, ($timeSinceStrongholdUnlocked) =>
    get(isSoftwareProfile)
        ? STRONGHOLD_PASSWORD_CLEAR_INTERVAL && $timeSinceStrongholdUnlocked > STRONGHOLD_PASSWORD_CLEAR_INTERVAL
        : false
)
