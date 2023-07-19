import { WalletEventType } from '@iota/wallet'

import { WalletApiEventHandler } from './wallet-api-event-handler.type'

export type WalletApiEventMap = {
    [key in WalletEventType]?: WalletApiEventHandler
}
