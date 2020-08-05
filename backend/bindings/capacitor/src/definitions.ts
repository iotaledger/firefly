declare module "@capacitor/core" {
  interface PluginRegistry {
    WalletPlugin: WalletPlugin;
  }
}

export interface WalletPlugin {
  sendMessage(message: string): Promise<{response: string}>;
}
