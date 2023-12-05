import { LedgerNanoStatus } from '@iota/sdk/out/types'
import { get } from 'svelte/store'
import { activeProfileSecretManager } from '../stores'

// TODO(2.0): Fix all of usages of this
export async function getLedgerNanoStatus(): Promise<LedgerNanoStatus | null> {
    const secretManager = get(activeProfileSecretManager)
    if (!secretManager) {
        return null
    }
    return secretManager.getLedgerNanoStatus()
}
