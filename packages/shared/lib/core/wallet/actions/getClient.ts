import { Client } from '@iota/sdk/out/client'
import { get } from 'svelte/store'
import { selectedAccount } from '@core/account'

export function getClient(): Promise<Client> {
    const account = get(selectedAccount)
    return account!.getClient()
}
