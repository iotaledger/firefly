import { IClientOptions } from '@core/network'
import { get } from 'svelte/store'
import { profileManager } from '../stores'

export async function setClientOptions(clientOptions: Partial<IClientOptions>): Promise<void> {
    const manager = get(profileManager)
    await manager.setClientOptions(clientOptions)
}
