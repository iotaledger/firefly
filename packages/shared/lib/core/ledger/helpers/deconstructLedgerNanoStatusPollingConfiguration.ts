import { profileManager as _profileManager } from '@core/profile-manager/stores'

import { DEFAULT_LEDGER_NANO_STATUS_POLL_INTERVAL } from '../constants'
import { ILedgerNanoStatusPollingConfiguration } from '../interfaces'

export function deconstructLedgerNanoStatusPollingConfiguration(
    config: ILedgerNanoStatusPollingConfiguration
): ILedgerNanoStatusPollingConfiguration {
    const pollInterval = config?.pollInterval ?? DEFAULT_LEDGER_NANO_STATUS_POLL_INTERVAL
    const profileManager = config?.profileManager ?? _profileManager

    return {
        pollInterval,
        profileManager,
    }
}
