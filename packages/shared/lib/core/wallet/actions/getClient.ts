import { Client } from '@iota/sdk/out/client'
import { selectedWalletId } from '@core/wallet/stores'
import { api } from '@core/api'
import { get } from 'svelte/store'

export function getClient(walletId: string = get(selectedWalletId)): Promise<Client> {
    return api.getClientFromWallet(walletId)
}
