import { Client } from '@iota/sdk/out/client'
import { selectedWalletId } from '@core/wallet/stores'
import { api } from '@core/api'
import { get } from 'svelte/store'

export function getClient(): Promise<Client> {
    const selectedWallet = get(selectedWalletId)

    return api.getClientFromWallet(selectedWallet)
}
