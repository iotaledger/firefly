import { LedgerNanoStatus } from '@iota/wallet'
import { get } from 'svelte/store'
import { profileManager as _profileManager } from '@core/profile-manager'

export function getLedgerNanoStatus(profileManager = _profileManager): Promise<LedgerNanoStatus> {
    const manager = get(profileManager)
    return manager.getLedgerNanoStatus()
}
