import { get } from 'svelte/store'
import { activeProfileSecretManager } from '../stores'

export async function changeStrongholdPassword(newPassword: string): Promise<void> {
    const activeProfileSecretManagerInstance = get(activeProfileSecretManager)
    await activeProfileSecretManagerInstance?.changeStrongholdPassword(newPassword)
}
