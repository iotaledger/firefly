import { SecretManager } from '@iota/wallet'

import { USE_LEDGER_SIMULATOR } from '@core/ledger'
import { ProfileType } from '@core/profile'

export function getSecretManagerFromProfileType(type: ProfileType, storagePath?: string): SecretManager {
    const strongholdSecretManager = {
        Stronghold: { snapshotPath: `${storagePath}/wallet.stronghold` },
    }
    const ledgerSecretManager = {
        LedgerNano: USE_LEDGER_SIMULATOR,
    }

    switch (type) {
        case ProfileType.Ledger:
            return ledgerSecretManager
        case ProfileType.Software:
        default:
            return strongholdSecretManager
    }
}
