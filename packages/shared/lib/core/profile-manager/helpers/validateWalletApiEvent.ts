import { IWalletApiEventPayloadWrapper, WalletApiEventPayload } from '@core/profile-manager'

export function validateWalletApiEvent(error: Error, rawEvent: string): IWalletApiEventPayloadWrapper {
    if (error) {
        console.error(error)
    } else {
        let { accountIndex, event } = JSON.parse(rawEvent)

        accountIndex = Number(accountIndex)
        if (Number.isNaN(accountIndex)) {
            console.error('Invalid event handler account index')
        }

        // TODO: Handle runtime type validation?
        if (!event) {
            console.error('Invalid event type')
        }

        return {
            accountIndex: <number>accountIndex,
            payload: <WalletApiEventPayload>event,
        }
    }
}
