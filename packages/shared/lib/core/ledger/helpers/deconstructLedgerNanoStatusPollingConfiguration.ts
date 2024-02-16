import { activeProfileSecretManager } from '@core/secret-manager'
import { DEFAULT_LEDGER_NANO_STATUS_POLL_INTERVAL } from '../constants'
import { ILedgerNanoStatusPollingConfiguration } from '../interfaces'

// TODO(2.0) Fix this
export function deconstructLedgerNanoStatusPollingConfiguration(
    config: ILedgerNanoStatusPollingConfiguration
): ILedgerNanoStatusPollingConfiguration {
    const pollInterval = config?.pollInterval ?? DEFAULT_LEDGER_NANO_STATUS_POLL_INTERVAL
    const secretManager = config?.secretManager ?? activeProfileSecretManager

    return {
        pollInterval,
        secretManager,
    }
}
