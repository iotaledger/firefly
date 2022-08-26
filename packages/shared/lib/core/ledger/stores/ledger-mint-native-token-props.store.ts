import { writable } from 'svelte/store'
import { LedgerMintNativeTokenProps } from '../interfaces'

export const ledgerMintNativeTokenProps = writable<LedgerMintNativeTokenProps>(null)

export function updateLedgerMintNativeTokenProps(payload: LedgerMintNativeTokenProps): void {
    ledgerMintNativeTokenProps.set(payload)
}

export function resetLedgerMintNativeTokenProps(): void {
    ledgerMintNativeTokenProps.set(null)
}
