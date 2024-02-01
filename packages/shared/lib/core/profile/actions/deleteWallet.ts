import { get } from 'svelte/store'

import { api } from '@core/api'
import { AppContext } from '@core/app/enums'
import { routerManager } from '@core/router/stores'
import {
    removeWalletFromActiveWallets,
    removeWalletPersistedDataFromActiveProfile,
    visibleActiveWallets,
} from '../stores'
import { CannotRemoveWalletError, RemoveNotLastWalletError, setSelectedWallet } from '@core/wallet'

export async function deleteWallet(id: string): Promise<void> {
    const wallets = get(visibleActiveWallets)
    const walletToBeDeleted = wallets.find((wallet) => wallet?.id === id)

    if (walletToBeDeleted !== wallets[wallets.length - 1]) {
        throw new RemoveNotLastWalletError()
    }

    try {
        await api.deleteWallet(id)
        removeWalletFromActiveWallets(id)
        removeWalletPersistedDataFromActiveProfile(id)
        setSelectedWallet(wallets[0]?.id ?? null)
        get(routerManager).resetRouterForAppContext(AppContext.Dashboard)
    } catch (err) {
        throw new CannotRemoveWalletError()
    }
}
