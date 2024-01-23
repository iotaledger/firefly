import { IWalletApiEventSubscriptionConfiguration } from '../interfaces'
import { getSelectedWallet } from '../stores'

export function subscribeToWalletApiEvents(configuration: IWalletApiEventSubscriptionConfiguration): void {
    const { eventMap, wallet } = configuration

    const selectedWallet = wallet && getSelectedWallet()

    Object.entries(eventMap).forEach(([event, callback]) => {
        const eventId = Number(event)
        void selectedWallet?.listen([eventId], callback)
    })
}
