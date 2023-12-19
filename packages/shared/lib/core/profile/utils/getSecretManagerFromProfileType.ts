import { SecretManagerType } from '@iota/sdk/out/types'

import { USE_LEDGER_SIMULATOR } from '@core/ledger'
import { ProfileType } from '@core/profile'

// TODO(2.0) Fix all usages
export function getSecretManagerFromProfileType(type?: ProfileType, storagePath?: string): SecretManagerType {
    const strongholdSecretManager = {
        stronghold: { snapshotPath: `${storagePath}/wallet.stronghold`, password: 'mellamobego' }, // TODO(2.0) Remove this harcoded password
    }
    const ledgerSecretManager = {
        ledgerNano: USE_LEDGER_SIMULATOR,
    }

    switch (type) {
        case ProfileType.Ledger:
            return ledgerSecretManager
        case ProfileType.Software:
        default:
            return strongholdSecretManager
    }
}
