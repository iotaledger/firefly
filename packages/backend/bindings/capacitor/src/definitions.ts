export interface WalletPluginTypes {
  initialize(actorId: { [key: string]: any }): Promise<void>
  destroy(actorId: { [key: string]: any }): Promise<void>
  sendMessage(message: { [key: string]: any }): Promise<void>
  addListener(walletEvent: 'walletEvent', cb: (jsonResponse: String) => void): void
}
