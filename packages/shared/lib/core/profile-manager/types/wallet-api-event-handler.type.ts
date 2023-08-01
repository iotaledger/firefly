import { Event } from '@iota/wallet'

export type WalletApiEventHandler = (error: Error, rawEvent: Event) => void | Promise<void>
