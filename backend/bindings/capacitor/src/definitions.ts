declare module "@capacitor/core" {
  interface PluginRegistry {
    WalletPlugin: WalletPlugin;
  }
}

export interface InitOptions {
  storagePath?: string
}

export interface WalletPlugin {
  initialize(options?: InitOptions): void;
  sendMessage(message: { [k: string]: any }): Promise<void>;
  addListener(event: 'walletMessageReceived', cb: (message: any) => void): void;
}
