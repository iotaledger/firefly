import { GenerateAddressOptions } from '@iota/sdk/out/types'
import { get } from 'svelte/store'
import { activeProfileSecretManager } from '../stores'

export async function generateEd25519Address(
    accountIndex: number, // TODO(2.0) account indexes are gone
    options: GenerateAddressOptions,
    bech32Hrp: string
): Promise<string | undefined> {
    const secretManager = get(activeProfileSecretManager)

    if (!secretManager) {
        return undefined
    }

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
