import { writable } from 'svelte/store'
import { IConfirmationPopup } from '../interfaces/confirmation-popup.interface'

export const confirmationPopup = writable<IConfirmationPopup>({
    open: false,
    title: '',
    description: '',
    callback: () => {},
})

export function openConfirmationPopup(title: string, description: string, callback: () => void): void {
    confirmationPopup.set({ open: true, title, description, callback })
}

export function closeConfirmationPopup(): void {
    confirmationPopup.set({ open: false, title: '', description: '', callback: () => {} })
}
