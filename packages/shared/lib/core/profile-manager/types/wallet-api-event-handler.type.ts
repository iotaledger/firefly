import { Event } from '@iota/sdk/out/types'

export type WalletApiEventHandler = (error: Error, rawEvent: Event) => void | Promise<void>
