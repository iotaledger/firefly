import { WalletEventType } from '@iota/wallet/out/types'

import { WalletApiEventHandler } from './wallet-api-event-handler.type'

export type WalletApiEventMap = {
    [key in WalletEventType]?: WalletApiEventHandler
}
