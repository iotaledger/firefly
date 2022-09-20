export type WalletApiEventHandler = (error: Error, rawEvent: string) => void | Promise<void>
