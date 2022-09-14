import { WalletApiEvent } from '../enums'
import { IWalletApiEventPayloadWrapper } from '../interfaces'

export function validateWalletApiEvent(
    error: Error,
    rawEvent: string,
    apiEvent: WalletApiEvent
): IWalletApiEventPayloadWrapper {
    if (error) {
        console.error(error)
        // TODO: make WalletApiEventValidation error and throw it here
    } else {
        let { accountIndex, event } = JSON.parse(rawEvent)

        accountIndex = Number(accountIndex)
        if (Number.isNaN(accountIndex)) {
            console.error('Invalid event handler account index')
        }

        const payload = event[apiEvent]
        if (!payload) {
            console.error('Invalid event payload type')
        }

        return {
            accountIndex,
            payload,
        }
    }
}
