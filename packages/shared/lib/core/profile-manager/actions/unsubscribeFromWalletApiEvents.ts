import { get, Writable } from 'svelte/store'

import { IProfileManager } from '../interfaces'
import { profileManager as _profileManager } from '../stores'

export async function unsubscribeFromWalletApiEvents(
    profileManager: Writable<IProfileManager> = _profileManager
): Promise<void> {
    await get(profileManager)?.clearListeners([])
}
