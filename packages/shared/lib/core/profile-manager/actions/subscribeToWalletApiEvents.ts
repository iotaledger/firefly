import { get, Writable } from 'svelte/store'

import { EventType } from '@iota/wallet'

import {
    handleNewOutputEvent,
    handleSpentOutputEvent,
    handleTransactionInclusionEvent,
    handleTransactionProgressEvent,
} from '../helpers/events-handlers'
import { IProfileManager, IWalletApiEventSubscriptionConfiguration } from '../interfaces'
import { profileManager as _profileManager } from '../stores'

export function subscribeToWalletApiEvents(configuration: IWalletApiEventSubscriptionConfiguration): void {
    const { eventMap, profileManager } = configuration
    const manager = profileManager ? profileManager : get(_profileManager)
    Object.entries(eventMap).forEach(([event, callback]) => {
        manager.listen([event as EventType], callback)
    })
}

export function subscribeToWalletApiEventsV1(profileManager: Writable<IProfileManager> = _profileManager): void {
    const manager = get(profileManager)

    manager.listen([], (error, result) => {
        if (error) {
            console.error(error)
        } else {
            const events = {
                NewOutput: handleNewOutputEvent,
                TransactionInclusion: handleTransactionInclusionEvent,
                SpentOutput: handleSpentOutputEvent,
                TransactionProgress: handleTransactionProgressEvent,
            }

            // do we need to handle the parsing?
            const { accountIndex, event } = JSON.parse(result)

            const eventNames = Object.keys(event)

            eventNames.forEach((name) => {
                events[name](accountIndex.toString(), event[name])
            })
        }
    })
}
