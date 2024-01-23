import { get } from 'svelte/store'
import { activeProfileSecretManager } from '../stores'

export async function clearStrongholdPassword(): Promise<void> {
    const secretManager = get(activeProfileSecretManager)
    await secretManager?.clearStrongholdPassword()
}
