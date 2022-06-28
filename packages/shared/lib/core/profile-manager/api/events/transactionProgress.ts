import { selectedAccountId } from '@core/account'
import { TransferProgressEventData } from '@lib/typings/events'
import { get } from 'svelte/store'

export function handleTransactionProgress(accountId: string, payload: TransferProgressEventData): void {
    if (get(selectedAccountId) === accountId) {
        console.warn('Transaction progress handler unimplemented: ', payload)
        // transferState.set({
        //     type: payload.type,
        //     data: payload,
        // })
    }
}
