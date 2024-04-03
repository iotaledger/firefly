import { get } from 'svelte/store'
import { api } from '@core/api'
import { IPersistedWalletData } from '@core/wallet/interfaces'
import { IPersistedProfile, IWallet } from '../interfaces'
import { activeProfile } from '../stores'

export async function getWallet(walletId: string): Promise<IWallet> {
    const profile: IPersistedProfile = get(activeProfile)
    // Persisted wallet data will only exist after the onboarding.
    const persistedWallet: IPersistedWalletData | undefined = profile?.walletPersistedData[walletId]
    // Automatically create a Wallet with the given WalletOptions in case it doesn't exist
    const wallet = await api.getWallet(walletId, persistedWallet?.walletOptions)
    return wallet
}
