import { addWalletPersistedDataToActiveProfile, getActiveProfilePersistedWalletData, IWallet } from '@core/profile'
import { DEFAULT_SYNC_OPTIONS } from '../constants'
import { IWalletState } from '../interfaces'
import { buildWalletStateAndPersistedData } from './buildWalletStateAndPersistedData'
import { buildWalletState } from './buildWalletState'

export async function loadWallet(wallet: IWallet): Promise<IWalletState> {
    const walletId = wallet.id
    await wallet.sync(DEFAULT_SYNC_OPTIONS)
    const walletPersistedData = getActiveProfilePersistedWalletData(walletId)

    let accountState: IWalletState
    if (walletPersistedData) {
        accountState = await buildWalletState(wallet, walletPersistedData)
    } else {
        const [newAccountState, walletPersistedData] = await buildWalletStateAndPersistedData(wallet)
        addWalletPersistedDataToActiveProfile(walletId, walletPersistedData)
        accountState = newAccountState
    }

    return accountState
}
