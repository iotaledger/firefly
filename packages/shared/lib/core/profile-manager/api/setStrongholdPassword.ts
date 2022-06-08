import { get } from 'svelte/store'
import { profileManager } from '../stores'

export async function setStrongholdPassword(password: string): Promise<void> {
    const manager = get(profileManager)
    await manager.setStrongholdPassword(password)
}
