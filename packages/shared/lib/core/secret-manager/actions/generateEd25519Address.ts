import { GenerateAddressOptions } from '@iota/sdk/out/types'
import { activeSecretManager } from '../stores'
import { get } from 'svelte/store'

// TODO(2.0): Fix all usages
export async function generateEd25519Address(
    accountIndex: number,
    options: GenerateAddressOptions,
    bech32Hrp: string
): Promise<string | undefined> {
    const secretManager = get(activeSecretManager)

    if (!secretManager) {
        return undefined
    }

    // TODO(2.0) Ledger secret manager doesn't support this
    return (
        await secretManager.generateEd25519Addresses({
            accountIndex,
            options,
            bech32Hrp,
            range: {
                start: 0,
                end: 1,
            },
        })
    )[0]
}
