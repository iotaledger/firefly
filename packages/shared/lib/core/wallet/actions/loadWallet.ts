import { addWalletPersistedDataToActiveProfile, getActiveProfilePersistedWalletData, IWallet } from '@core/profile'
import { DEFAULT_SYNC_OPTIONS } from '../constants'
import { IWalletState } from '../interfaces'
import { buildWalletStateAndPersistedData } from './buildWalletStateAndPersistedData'
import { buildWalletState } from './buildWalletState'
import { getTotalWalletBalance } from '..'

export async function loadWallet(profileId: string, wallet: IWallet): Promise<IWalletState> {
    const walletId = wallet.id
    await wallet.sync(DEFAULT_SYNC_OPTIONS)
    const walletPersistedData = getActiveProfilePersistedWalletData(walletId)

    let walletState: IWalletState
    if (walletPersistedData) {
        walletState = await buildWalletState(wallet, walletPersistedData)
        walletState.balances = await getTotalWalletBalance(walletState, true)
    } else {
        const [newWalletState, walletPersistedData] = await buildWalletStateAndPersistedData(profileId, wallet)
        addWalletPersistedDataToActiveProfile(walletId, walletPersistedData)
        walletState = newWalletState
    }

    return walletState
}
