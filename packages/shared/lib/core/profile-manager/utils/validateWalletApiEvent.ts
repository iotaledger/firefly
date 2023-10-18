import { localize } from '@core/i18n'

import { Event, WalletEventType } from '@iota/sdk/out/types'

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
        const { accountIndex, event } = rawEvent

        if (Number.isNaN(accountIndex)) {
            throw new WalletApiEventValidationError(
                localize('error.walletApiEvent.invalidAccountIndex', { values: { eventName: apiEvent } })
            )
        }

        const payload = event.type === apiEvent ? event : undefined
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
