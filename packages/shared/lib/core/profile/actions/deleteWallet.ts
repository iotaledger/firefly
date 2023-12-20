import { get } from 'svelte/store'

import { api } from '@core/api'
import { AppContext } from '@core/app/enums'
import { routerManager } from '@core/router/stores'
import { visibleActiveWallets } from '../stores'
import { CannotRemoveWalletError, RemoveNotLastWalletError, setSelectedWallet } from '@core/wallet'

// TODO(2.0): replace all its usage, before it was numeric index, now it's id
export async function deleteWallet(id: string): Promise<void> {
    const wallets = get(visibleActiveWallets)
    const walletToBeDeleted = wallets.find((wallet) => wallet?.id === id)

    if (walletToBeDeleted !== wallets[wallets.length - 1]) {
        throw new RemoveNotLastWalletError()
    }

    try {
        await api.deleteWallet(id)
        // TODO(2.0) do we need this?: removewalletFromactiveWallets(id)
        setSelectedWallet(wallets[0]?.id ?? null)
        get(routerManager).resetRouterForAppContext(AppContext.Dashboard)
    } catch (err) {
        throw new CannotRemoveWalletError()
    }
}
