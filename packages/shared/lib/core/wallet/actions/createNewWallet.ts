import { localize } from '@core/i18n'
import { activeAccounts, addWalletPersistedDataToActiveProfile, addAccountToActiveAccounts, createWallet } from '@core/profile'
import { addEmptyAccountActivitiesToAllAccountActivities } from '@core/wallet/stores'
import { get } from 'svelte/store'

import { DEFAULT_SYNC_OPTIONS } from '../../account/constants'
import { IWalletState } from '../../account/interfaces'

import { buildWalletStateAndPersistedData } from './buildWalletStateAndPersistedData'

export async function createNewWallet(name?: string, color?: string): Promise<IWalletState> {
    // 1. Get the wallet name
    const walletName = name || `${localize('general.account')} ${(get(activeAccounts)?.length ?? 0) + 1}`;

    // 2. Create the wallet instance
    const wallet = await createWallet()

    // 3. Sync the wallet with the Node
    // TODO(2.0): test & fix sync when we have iota2.0 nodes
    //await account.sync(DEFAULT_SYNC_OPTIONS)

    // 4. Create a wrapper over the wallet instance and the persisted data
    const [walletState, accountPersistedData] = await buildWalletStateAndPersistedData(wallet, walletName, color)

    // TODO(2.0) Fix
    // addAccountToActiveAccounts(walletState)
    addWalletPersistedDataToActiveProfile(walletState.id, accountPersistedData)
    // TODO(2.0) Fix
    // addEmptyAccountActivitiesToAllAccountActivities(walletState.id)


    return walletState
}
