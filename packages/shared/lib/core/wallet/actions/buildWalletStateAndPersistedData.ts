import { localize } from '@core/i18n'
import { getRandomWalletColor } from '@core/wallet/utils'
import { IWallet } from '@core/profile/interfaces'
import { IWalletState } from '../interfaces/wallet-state.interface'
import { IPersistedWalletData } from '../interfaces/persisted-wallet-data.interface'
import { buildWalletState } from './buildWalletState'
import { activeProfile, getStorageDirectoryOfProfile, getWalletOptions } from '@core/profile'
import { get } from 'svelte/store'

export async function buildWalletStateAndPersistedData(
    wallet: IWallet,
    name?: string,
    color?: string
): Promise<[IWalletState, IPersistedWalletData]> {
    const storagePath = await getStorageDirectoryOfProfile(wallet.id)
    const walletOptions = getWalletOptions(get(activeProfile), storagePath)

    const persistedWalletData: IPersistedWalletData = {
        name: name || `${localize('general.wallet')}`,
        color: color || getRandomWalletColor(),
        hidden: false,
        shouldRevote: false,
        walletOptions,
    }
    const walletState = await buildWalletState(wallet, persistedWalletData)
    return [walletState, persistedWalletData]
}
