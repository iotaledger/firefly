import { WalletEvent } from '@iota/sdk/out/types'

export type WalletApiEventHandler = (error: Error, rawEvent: WalletEvent) => void | Promise<void>
