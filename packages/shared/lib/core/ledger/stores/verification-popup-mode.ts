import { writable } from 'svelte/store'

export enum VerificationPopupMode {
    Default,
    Internal,
    Block,
}

export const verificationPopupMode = writable<VerificationPopupMode>(VerificationPopupMode.Default)

export function resetShowInternalVerificationPopup(): void {
    verificationPopupMode.set(VerificationPopupMode.Default)
}
