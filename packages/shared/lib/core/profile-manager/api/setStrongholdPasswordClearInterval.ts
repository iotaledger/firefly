import { get } from 'svelte/store'
import { profileManager } from '../stores'

export async function setStrongholdPasswordClearInterval(intervalInSeconds: number): Promise<void> {
    const manager = get(profileManager)
    await manager.setStrongholdPasswordClearInterval(intervalInSeconds * 1000)
}
