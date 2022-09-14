import { LedgerNanoStatus } from '@iota/wallet'
import { get, Writable } from 'svelte/store'
import { IProfileManager, profileManager as _profileManager } from '@core/profile-manager'

export function getLedgerNanoStatus(
    profileManager: Writable<IProfileManager> = _profileManager
): Promise<LedgerNanoStatus> {
    const manager = get(profileManager)
    return manager.getLedgerNanoStatus()
}
