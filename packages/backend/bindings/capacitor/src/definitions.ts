export interface WalletPlugin {
  initialize(actorId: String): Promise<void>;
  destroy(actorId: String): Promise<void>;
  sendMessage(message: { [key: string]: any }): Promise<void>;
  addListener(actorId: String, id: String, event: { [key: string]: any }): Promise<void>;
}
