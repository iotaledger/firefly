import { LedgerStatus } from '@iota/wallet'
import { get } from 'svelte/store'
import { profileManager } from '../stores'

export async function getLedgerStatus(): Promise<LedgerStatus> {
    const manager = get(profileManager)

    return manager.getLedgerStatus()
}
