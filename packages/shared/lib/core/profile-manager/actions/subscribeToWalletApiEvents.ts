import { get } from 'svelte/store'
import { profileManager } from '../stores'
import {
    handleNewOutputEvent,
    handleSpentOutputEvent,
    handleTransactionInclusionEvent,
    handleTransactionProgressEvent,
} from '../api/events'

export function subscribeToWalletApiEvents(): void {
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

// TODO: Are those required?

// /**
//  * Event listener for reattachment
//  */
//  api.onReattachment({
//     onSuccess(response) {
//         // Replace original message with reattachment
//         replaceMessage(response.payload.accountId, response.payload.reattachedMessageId, response.payload.message)
//     },
//     onError(error) {
//         console.error(error)
//     },
// })

// /**
//  * Event listener for Ledger receive address generation
//  */
// api.onLedgerAddressGeneration({
//     onSuccess(response) {
//         const { event } = response.payload
//         openPopup({
//             type: 'ledgerAddress',
//             hideClose: true,
//             preventClose: true,
//             props: {
//                 address: event.address,
//             },
//         })
//     },
//     onError(error) {
//         console.error(error)
//     },
// })
