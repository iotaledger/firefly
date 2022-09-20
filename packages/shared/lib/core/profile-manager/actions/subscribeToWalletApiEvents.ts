import { get } from 'svelte/store'

import { EventType } from '@iota/wallet'

import { IWalletApiEventSubscriptionConfiguration } from '../interfaces'
import { profileManager as _profileManager } from '../stores'

export function subscribeToWalletApiEvents(configuration: IWalletApiEventSubscriptionConfiguration): void {
    const { eventMap, profileManager } = configuration
    const manager = profileManager ?? get(_profileManager)
    Object.entries(eventMap).forEach(([event, callback]) => {
        manager.listen([event as EventType], callback)
    })
}
