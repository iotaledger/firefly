import { PluginListenerHandle } from "@capacitor/core";

export interface WalletPluginTypes {
  initialize(options: { actorId: string, storagePath: string }): Promise<void>
  listen(options: { actorId: string, id: string, event: string }): Promise<string>
  destroy(options: { actorId: string }): Promise<void>
  sendMessage(message: { [key: string]: any }): Promise<void>
  addListener(walletEvent: 'walletEvent', cb: (message: {walletResponse: any}) => void): PluginListenerHandle
  migrateStrongholdSnapshotV2ToV3(options: { currentPath: string, currentPassword: string, newPath: string, newPassword: string }): Promise<void>
}
