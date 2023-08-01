import { Event } from '@iota/wallet/out/types'

export type WalletApiEventHandler = (error: Error, rawEvent: Event) => void | Promise<void>
