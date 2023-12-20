import { WalletEventType } from '@iota/sdk/out/types'

import { WalletApiEventHandler } from './wallet-api-event-handler.type'

export type WalletApiEventMap = {
    [key in WalletEventType]?: WalletApiEventHandler
}
