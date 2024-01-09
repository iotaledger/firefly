import { get } from 'svelte/store'
import { activeProfile } from '../../profile'
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
        const { accountIndex, event } = rawEvent
        const profile = get(activeProfile)
        const walletId = Object.keys(profile.walletPersistedData)[accountIndex]

        if (Number.isNaN(walletId)) {
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
            walletId,
            payload,
        }
    }
}
