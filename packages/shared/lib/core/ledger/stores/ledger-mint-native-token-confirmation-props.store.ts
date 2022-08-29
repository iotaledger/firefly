import { writable } from 'svelte/store'

import { LedgerMintNativeTokenConfirmationProps } from '../interfaces'

export const ledgerMintNativeTokenConfirmationProps = writable<LedgerMintNativeTokenConfirmationProps>(null)

export function updateLedgerMintNativeTokenConfirmationProps(payload: LedgerMintNativeTokenConfirmationProps): void {
    ledgerMintNativeTokenConfirmationProps.set(payload)
}

export function resetLedgerMintNativeTokenConfirmationProps(): void {
    ledgerMintNativeTokenConfirmationProps.set(null)
}
