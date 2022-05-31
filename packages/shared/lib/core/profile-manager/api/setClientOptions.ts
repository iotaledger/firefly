import { get } from 'svelte/store'

import { ClientOptions } from '@iota/wallet'

import { IClientOptions } from '@core/network'

import { profileManager } from '../store'

export async function setClientOptions(clientOptions: Partial<IClientOptions>): Promise<void> {
    const manager = get(profileManager)
    await manager.setClientOptions(<ClientOptions>clientOptions)
}
