import { get } from 'svelte/store'
import { profileManager } from '../../stores'
import { handleNewOutputEvent } from './newOutput'
import { handleTransactionInclusionEvent } from './newTransactionInclusionEvent'
import { handleSpentOutput } from './spentOutput'

export function subscribe(): void {
    const manager = get(profileManager)

    manager.listen([], (error, result) => {
        if (error) {
            console.error(error)
        } else {
            const events = {
                NewOutput: handleNewOutputEvent,
                TransactionInclusion: handleTransactionInclusionEvent,
                SpentOutput: handleSpentOutput,
                // ...
            }

            // do we need to handle the parsing?
            const { event } = JSON.parse(result)

            const eventNames = Object.keys(event)

            eventNames.forEach((name) => {
                events[name](accountIndex.toString(), event[name])
            })
        }
    })
}
