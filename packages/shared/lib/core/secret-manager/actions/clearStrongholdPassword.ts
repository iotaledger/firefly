import { get } from 'svelte/store'
import { activeProfileSecretManager as activeProfileSecretManagerStore } from '../stores'

export async function clearStrongholdPassword(): Promise<void> {
    const activeProfileSecretManagerInstance = get(activeProfileSecretManagerStore)
    await activeProfileSecretManagerInstance?.clearStrongholdPassword()
}
