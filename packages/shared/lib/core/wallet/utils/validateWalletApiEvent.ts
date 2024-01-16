import { localize } from '@core/i18n'
import { WalletEvent, WalletEventType } from '@iota/sdk/out/types'
import { WalletApiEventError, WalletApiEventValidationError } from '../errors'

export function validateWalletApiEvent(error: Error, rawEvent: WalletEvent, apiEvent: WalletEventType): void {
    if (error) {
        throw new WalletApiEventError(error)
    } else if (rawEvent?.type !== apiEvent) {
        throw new WalletApiEventValidationError(
            localize('error.walletApiEvent.invalidPayload', { values: { eventName: apiEvent } })
        )
    }
}
