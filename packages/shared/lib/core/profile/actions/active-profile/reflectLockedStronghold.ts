import { activeProfile, clearTimeStrongholdLastUnlocked } from '@core/profile'
import { get } from 'svelte/store'

export function reflectLockedStronghold(): void {
    const { isStrongholdLocked } = get(activeProfile)
    isStrongholdLocked?.set(true)
    clearTimeStrongholdLastUnlocked()
}
