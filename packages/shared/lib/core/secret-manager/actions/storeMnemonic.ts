import { get } from 'svelte/store'
import { activeProfileSecretManager } from '../stores'

export async function storeMnemonic(mnemonic: string): Promise<void> {
    const secretManager = get(activeProfileSecretManager)

    if (!secretManager) {
        return undefined
    }
    return secretManager.storeMnemonic(mnemonic)
}
