import { selectedAccountId } from '@core/account'
import { TransferProgressEventData } from '@lib/typings/events'
import { transferState } from '@lib/wallet'
import { get } from 'svelte/store'

export function handleTransactionProgress(accountId: string, payload: TransferProgressEventData): void {
    if (get(selectedAccountId) === accountId) {
        transferState.set({
            type: payload.type,
            data: payload,
        })
    }
}
