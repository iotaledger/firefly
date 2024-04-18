import { localize } from '@core/i18n'
import { getRandomWalletColor } from '@core/wallet/utils'
import { IWallet } from '@core/profile/interfaces'
import { IWalletState } from '../interfaces/wallet-state.interface'
import { IPersistedWalletData } from '../interfaces/persisted-wallet-data.interface'
import { buildWalletState } from './buildWalletState'
import { activeProfile, getWalletOptions, DirectoryManager } from '@core/profile'
import { get } from 'svelte/store'
import { getTotalWalletBalance } from '..'

export async function buildWalletStateAndPersistedData(
    profileId: string,
    wallet: IWallet,
    name?: string,
    color?: string
): Promise<[IWalletState, IPersistedWalletData]> {
    const walletPath = await DirectoryManager.forWallet(profileId, wallet.id)
    const secretManagerPath = await DirectoryManager.forSecretManager(profileId)

    const walletOptions = getWalletOptions(get(activeProfile), walletPath, secretManagerPath)

    const persistedWalletData: IPersistedWalletData = {
        name: name || `${localize('general.wallet')}`,
        color: color || getRandomWalletColor(),
        hidden: false,
        shouldRevote: false,
        walletOptions,
    }
    const walletState = await buildWalletState(wallet, persistedWalletData)
    walletState.balances = await getTotalWalletBalance(walletState, true)
    return [walletState, persistedWalletData]
}
