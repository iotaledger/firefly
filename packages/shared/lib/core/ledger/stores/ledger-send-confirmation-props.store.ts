import { writable } from 'svelte/store'

import { LedgerSendConfirmationProps } from '../interfaces'

export const ledgerSendConfirmationProps = writable<LedgerSendConfirmationProps>(null)

export function setLedgerSendConfirmationProps(payload: LedgerSendConfirmationProps): void {
    ledgerSendConfirmationProps.set(payload)
}

export function resetLedgerSendConfirmationProps(): void {
    ledgerSendConfirmationProps.set(null)
}
