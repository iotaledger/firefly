import type { CoinType } from './account';
import type { ClientOptions } from './network';
import type { SecretManager } from './secretManager';

/** Options for the AccountManager builder */
export interface AccountManagerOptions {
    storagePath?: string;
    clientOptions?: ClientOptions;
    coinType?: CoinType;
    secretManager?: SecretManager;
}
