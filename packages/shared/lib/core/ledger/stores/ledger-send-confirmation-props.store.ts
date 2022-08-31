import { writable } from 'svelte/store'

import { ILedgerSendConfirmationProps } from '../interfaces'

export const ledgerSendConfirmationProps = writable<ILedgerSendConfirmationProps>(null)

export function setLedgerSendConfirmationProps(payload: ILedgerSendConfirmationProps): void {
    ledgerSendConfirmationProps.set(payload)
}

export function resetLedgerSendConfirmationProps(): void {
    ledgerSendConfirmationProps.set(null)
}
