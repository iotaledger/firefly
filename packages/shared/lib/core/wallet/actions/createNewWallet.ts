import { localize } from '@core/i18n'
import {
    activeWallets,
    addWalletPersistedDataToActiveProfile,
    addWalletToActiveWallets,
    createWallet,
} from '@core/profile'
import { get } from 'svelte/store'

import { DEFAULT_SYNC_OPTIONS } from '@core/wallet/constants'
import { IWalletState } from '@core/wallet/interfaces'

import { buildWalletStateAndPersistedData } from './buildWalletStateAndPersistedData'
import { addEmptyWalletActivitiesToAllWalletActivities } from '../stores'

export async function createNewWallet(name?: string, color?: string): Promise<IWalletState> {
    // 1. Get the wallet name
    const walletName = name || `${localize('general.wallet')} ${(get(activeWallets)?.length ?? 0) + 1}`

    // 2. Create the wallet instance
    const wallet = await createWallet()

    // 3. Sync the wallet with the Node
    await wallet.sync(DEFAULT_SYNC_OPTIONS)

    // 4. Create a wrapper over the wallet instance and the persisted data
    const [walletState, walletPersistedData] = await buildWalletStateAndPersistedData(wallet, walletName, color)

    addWalletToActiveWallets(walletState)
    addWalletPersistedDataToActiveProfile(walletState.id, walletPersistedData)
    addEmptyWalletActivitiesToAllWalletActivities(walletState.id)

    return walletState
}
