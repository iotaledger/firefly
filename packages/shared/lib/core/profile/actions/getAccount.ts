import { get } from 'svelte/store'
import { api } from '@core/api'
import { IPersistedWalletData } from '@core/wallet/interfaces'
import { IPersistedProfile, IWallet } from '../interfaces'
import {activeProfile } from '../stores'

// TODO(2.0): Fix all usages of this method, before numeric index, now string
export async function getWallet(walletId: string): Promise<IWallet> {
    const profile: IPersistedProfile = get(activeProfile)
    const persistedWallet: IPersistedWalletData = profile?.accountPersistedData[walletId]
    const wallet = await api.getAccount(walletId, persistedWallet.walletOptions)
    return wallet
}
