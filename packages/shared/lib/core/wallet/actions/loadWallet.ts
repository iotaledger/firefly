import { addWalletPersistedDataToActiveProfile, getActiveProfilePersistedWalletData, IWallet } from '@core/profile'
import { DEFAULT_SYNC_OPTIONS } from '../constants'
import { IWalletState } from '../interfaces'
import { buildWalletStateAndPersistedData } from './buildWalletStateAndPersistedData'
import { buildWalletState } from './buildWalletState'

// TODO(2.0) Fix all usages (it was called loadAccount before)
export async function loadWallet(wallet: IWallet): Promise<IWalletState> {
    // Temporary sync on load until we enable background sync and event listeners
    const walletId = wallet.id
    // TODO(2.0): test & fix sync when we have iota2.0 nodes
    // await wallet.sync({ ...DEFAULT_SYNC_OPTIONS })
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
