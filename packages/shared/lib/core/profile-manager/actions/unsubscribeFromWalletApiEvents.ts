import { get, Writable } from 'svelte/store'

import { IProfileManager } from '../interfaces'
import { profileManager as _profileManager } from '../stores'

export function unsubscribeFromWalletApiEvents(profileManager: Writable<IProfileManager> = _profileManager): void {
    get(profileManager)?.clearListeners([])
}
