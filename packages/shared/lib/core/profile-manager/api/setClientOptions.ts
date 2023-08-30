import { ClientOptions } from '@core/network'
import { get } from 'svelte/store'
import { profileManager } from '../stores'

export async function setClientOptions(clientOptions: Partial<ClientOptions>): Promise<void> {
    const manager = get(profileManager)
    await manager.setClientOptions(clientOptions)
}
