import { localize } from '@core/i18n'

import { WalletEventType, Event } from '@iota/wallet'
import { WalletApiEventError, WalletApiEventValidationError } from '../errors'
import { IWalletApiEventPayloadWrapper } from '../interfaces'

export function validateWalletApiEvent(
    error: Error,
    rawEvent: Event,
    apiEvent: WalletEventType
): IWalletApiEventPayloadWrapper {
    if (error) {
        throw new WalletApiEventError(error)
    } else {
        /* eslint-disable-next-line prefer-const */
        const accountIndex = rawEvent.getAccountIndex()
        const event = rawEvent.getEvent()

        // accountIndex = Number(accountIndex)
        if (Number.isNaN(accountIndex)) {
            throw new WalletApiEventValidationError(
                localize('error.walletApiEvent.invalidAccountIndex', { values: { eventName: apiEvent } })
            )
        }

        const payload = event.getType() === apiEvent ? event : undefined
        if (!payload) {
            throw new WalletApiEventValidationError(
                localize('error.walletApiEvent.invalidPayload', { values: { eventName: apiEvent } })
            )
        }

        return {
            accountIndex,
            payload,
        }
    }
}
