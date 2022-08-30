import { get } from 'svelte/store'

import { profileManager } from '../stores'

export function unsubscribeFromWalletApiEvents(): void {
    get(profileManager)?.clearListeners([])
}
