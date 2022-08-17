import { LedgerStatus } from '@lib/core/ledger'
import { get } from 'svelte/store'
import { profileManager } from '../stores'

export function getLedgerStatus(): Promise<LedgerStatus> {
    const manager = get(profileManager)

    // @ts-ignore
    // TODO: The types probably need to get updated.
    return manager.getLedgerNanoStatus()
}
