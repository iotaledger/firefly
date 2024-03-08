import { LedgerNanoStatus } from '@iota/sdk/out/types'
import { get } from 'svelte/store'
import { activeProfileSecretManager } from '../stores'

export async function getLedgerNanoStatus(
    secretManager = get(activeProfileSecretManager)
): Promise<LedgerNanoStatus | null> {
    if (!secretManager) {
        return null
    }
    return secretManager.getLedgerNanoStatus()
}
