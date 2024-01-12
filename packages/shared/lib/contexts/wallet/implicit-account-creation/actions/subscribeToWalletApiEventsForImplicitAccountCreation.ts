import { WalletEventType } from '@iota/sdk/out/types'

import { getSelectedWallet, subscribeToWalletApiEvents, WalletApiEventMap } from '@core/wallet'
import { handleNewOutputForImplicitAccountCreation } from './handleNewOutputForImplicitAccountCreation'

export function subscribeToWalletApiEventsForImplicitAccountCreation(): void {
    const wallet = getSelectedWallet()
    const eventMap: WalletApiEventMap = {
        [WalletEventType.NewOutput]: handleNewOutputForImplicitAccountCreation,
    }

    subscribeToWalletApiEvents({
        eventMap,
        wallet,
    })
}
