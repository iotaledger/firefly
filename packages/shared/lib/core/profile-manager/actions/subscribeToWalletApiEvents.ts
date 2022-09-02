import { get, Writable } from 'svelte/store'

import {
    handleNewOutputEvent,
    handleSpentOutputEvent,
    handleTransactionInclusionEvent,
    handleTransactionProgressEvent,
} from '../api'
import { IProfileManager } from '../interfaces'
import { profileManager as _profileManager } from '../stores'

export function subscribeToWalletApiEvents(profileManager: Writable<IProfileManager> = _profileManager): void {
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
