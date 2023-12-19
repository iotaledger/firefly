import { IWalletApiEventSubscriptionConfiguration } from '../interfaces'
import { getSelectedWallet } from '../stores'

// TODO(2.0): Fix all of usages of this
export function subscribeToWalletApiEvents(configuration: IWalletApiEventSubscriptionConfiguration): void {
    const { eventMap, wallet } = configuration

    const selectedWallet = wallet && getSelectedWallet()

    Object.entries(eventMap).forEach(([event, callback]) => {
        const eventId = Number(event)
        void selectedWallet?.listen([eventId], callback)
    })
}
