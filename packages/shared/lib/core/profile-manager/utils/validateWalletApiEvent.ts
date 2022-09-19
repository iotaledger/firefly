import { localize } from '@core/i18n'

import { WalletApiEvent } from '../enums'
import { WalletApiEventError, WalletApiEventValidationError } from '../errors'
import { IWalletApiEventPayloadWrapper } from '../interfaces'

export function validateWalletApiEvent(
    error: Error,
    rawEvent: string,
    apiEvent: WalletApiEvent
): IWalletApiEventPayloadWrapper {
    if (error) {
        throw new WalletApiEventError(error)
    } else {
        /* eslint-disable-next-line prefer-const */
        let { accountIndex, event } = JSON.parse(rawEvent)

        accountIndex = Number(accountIndex)
        if (Number.isNaN(accountIndex)) {
            throw new WalletApiEventValidationError(
                localize('error.walletApiEvent.invalidAccountIndex', { values: { eventName: apiEvent } })
            )
        }

        const payload = event[apiEvent]
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
