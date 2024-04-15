import { SecretManagerType } from '@iota/sdk/out/types'

import { USE_LEDGER_SIMULATOR } from '@core/ledger'
import { ProfileType } from '@core/profile'

export function getSecretManagerFromProfileType(
    type?: ProfileType,
    strongholdPath?: string,
    // TODO: MOVE STONGHOLD FILE TO PROFILE FOLDER
    // TODO: USE RESTORE PATH
    password?: string
): SecretManagerType {
    const strongholdSecretManager = {
        stronghold: { snapshotPath: `${strongholdPath}/wallet.stronghold`, password },
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
