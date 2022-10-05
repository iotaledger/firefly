import { writable } from 'svelte/store'

export const showInternalVerificationPopup = writable<boolean>(false)

export function resetShowInternalVerificationPopup(): void {
    showInternalVerificationPopup.set(false)
}
