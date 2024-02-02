import { api } from '@core/api'
import { activeProfile } from '@core/profile/stores'
import { get } from 'svelte/store'
import { IWallet } from '../interfaces/wallet.interface'

export async function getWallets(): Promise<IWallet[]> {
    const profile = get(activeProfile)
    let wallets: IWallet[] = []
    if (profile.walletPersistedData) {
        wallets = await Promise.all(
            Object.entries(profile.walletPersistedData).map(([id, data]) => api.getWallet(id, data.walletOptions))
        )
    }
    return wallets
}
