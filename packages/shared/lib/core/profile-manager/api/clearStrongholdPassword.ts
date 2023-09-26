import { get } from 'svelte/store'
import { profileManager } from '../stores'

export async function clearStrongholdPassword(): Promise<void> {
    const manager = get(profileManager)
    await manager?.clearStrongholdPassword()
}
