import { profileManager as _profileManager } from '@core/profile-manager'

import { LEDGER_STATUS_POLL_INTERVAL } from '../constants'
import { ILedgerStatusPollingConfiguration } from '../interfaces'

export function deconstructLedgerStatusPollingConfiguration(
    config: ILedgerStatusPollingConfiguration
): ILedgerStatusPollingConfiguration {
    const pollInterval = config?.pollInterval ?? LEDGER_STATUS_POLL_INTERVAL
    const profileManager = config?.profileManager ?? _profileManager

    return {
        pollInterval,
        profileManager,
    }
}
