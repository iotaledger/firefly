import { get } from 'svelte/store'
import { api } from '@core/api'
import { IPersistedWalletData } from '@core/wallet/interfaces'
import { IPersistedProfile, IWallet } from '../interfaces'
import { activeProfile } from '../stores'

export async function getWallet(walletId: string): Promise<IWallet> {
    const profile: IPersistedProfile = get(activeProfile)
    const persistedWallet: IPersistedWalletData = profile?.walletPersistedData[walletId]
    const wallet = await api.getWallet(walletId, persistedWallet.walletOptions)
    return wallet
}
