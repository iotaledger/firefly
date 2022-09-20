import { WalletApiEvent } from '../enums'

import { WalletApiEventHandler } from './wallet-api-event-handler.type'

export type WalletApiEventMap = {
    [key in WalletApiEvent]?: WalletApiEventHandler
}
