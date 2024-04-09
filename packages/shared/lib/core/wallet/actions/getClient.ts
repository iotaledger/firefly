import { Client } from '@iota/sdk/out/client'
import { selectedWalletId } from '@core/wallet/stores'
import { api } from '@core/api'
import { get } from 'svelte/store'
import { getWalletById } from '../../profile'

export function getClient(walletId: string = get(selectedWalletId)): Promise<Client> {
    const wallet = getWalletById(walletId)
    if (wallet) {
        return api.getClientFromWallet(walletId)
    }
}
