import { writable } from 'svelte/store'

import { ILedgerMintNativeTokenConfirmationProps } from '../interfaces'

export const ledgerMintNativeTokenConfirmationProps = writable<ILedgerMintNativeTokenConfirmationProps>(null)

export function updateLedgerMintNativeTokenConfirmationProps(payload: ILedgerMintNativeTokenConfirmationProps): void {
    ledgerMintNativeTokenConfirmationProps.set(payload)
}

export function resetLedgerMintNativeTokenConfirmationProps(): void {
    ledgerMintNativeTokenConfirmationProps.set(null)
}
