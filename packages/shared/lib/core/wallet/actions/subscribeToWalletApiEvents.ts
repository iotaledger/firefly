import { selectedAccount } from '@core/account/stores';
import { get } from 'svelte/store';
import { IWalletApiEventSubscriptionConfiguration } from '../interfaces';

// TODO(2.0): Fix all of usages of this
export function subscribeToWalletApiEvents(configuration: IWalletApiEventSubscriptionConfiguration): void {
    const { eventMap, wallet } = configuration

    const selectedWallet = wallet && get(selectedAccount);

    Object.entries(eventMap).forEach(([event, callback]) => {
        const eventId = Number(event)
        void selectedWallet?.listen([eventId], callback)
    })
}
