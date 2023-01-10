/** Secret manager that uses a Ledger Nano hardware wallet or Speculos simulator. */
export interface LedgerNanoSecretManager {
    /** boolean indicates whether it's a simulator or not. */
    ledgerNano: boolean;
}

/** Secret manager that uses a mnemonic. */
export interface MnemonicSecretManager {
    mnemonic: string;
}

/** Secret manager that uses a seed. */
export interface SeedSecretManager {
    hexSeed: string;
}

/** Secret manager that uses Stronghold. */
export interface StrongholdSecretManager {
    stronghold: {
        password?: string;
        snapshotPath?: string;
    };
}

/** The status of a Ledger Nano */
export interface LedgerNanoStatus {
    connected: boolean;
    locked: boolean;
    blindSigningEnabled: boolean;
    app?: LedgerApp;
    device?: LedgerDeviceType;
    bufferSize?: number;
}

/** The current opened app */
export interface LedgerApp {
    name: string;
    version: string;
}

/** The Ledger Device Type */
export enum LedgerDeviceType {
    LedgerNanoS = 'ledgerNanoS',
    LedgerNanoX = 'ledgerNanoX',
    LedgerNanoSPlus = 'ledgerNanoSPlus',
}

/** Supported secret managers */
export type SecretManager =
    | LedgerNanoSecretManager
    | MnemonicSecretManager
    | StrongholdSecretManager;
