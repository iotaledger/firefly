import type { PluginListenerHandle } from "@capacitor/core";
//import type { MessageResponse } from '../../../../shared/lib/typings/bridge'
export interface WalletPluginTypes {
  initialize(options: { actorId: string }): Promise<void>
  listen(options: { actorId: string, id: string, event: string }): Promise<string>
  destroy(options: { actorId: string }): Promise<void>
  sendMessage(message: { [key: string]: any }): Promise<void>
  addListener(walletEvent: 'walletEvent', cb: (message: {walletResponse: any}) => void): PluginListenerHandle
}
