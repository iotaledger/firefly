import { LedgerNanoStatus } from '@iota/wallet'
import { get } from 'svelte/store'
import { profileManager } from '../stores'

export function getLedgerNanoStatus(): Promise<LedgerNanoStatus> {
    const manager = get(profileManager)
    return manager.getLedgerNanoStatus()
}
