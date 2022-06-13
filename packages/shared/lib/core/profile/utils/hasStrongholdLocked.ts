import { get } from 'svelte/store'
import { STRONGHOLD_PASSWORD_CLEAR_INTERVAL } from '../constants'
import { isSoftwareProfile } from '../stores'

export function hasStrongholdLocked(timeSinceStrongholdUnlocked: number): boolean {
    if (get(isSoftwareProfile)) {
        // If STRONGHOLD_PASSWORD_CLEAR_INTERVAL = 0 we want to return false, because this means stronghold is not going to automatically lock
        return STRONGHOLD_PASSWORD_CLEAR_INTERVAL && timeSinceStrongholdUnlocked > STRONGHOLD_PASSWORD_CLEAR_INTERVAL
    } else {
        return false
    }
}
