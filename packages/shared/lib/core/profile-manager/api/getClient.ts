import { Client } from '@iota/sdk/out/client'
import { api } from './api'
import { get } from 'svelte/store'
import { profileManager } from '../stores'

export function getClient(manager = profileManager): Promise<Client> {
    const { id } = get(manager)
    return api.getClient(id)
}
