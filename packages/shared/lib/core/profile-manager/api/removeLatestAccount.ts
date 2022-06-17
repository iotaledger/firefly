import { get } from 'svelte/store'

import { profileManager } from '../stores'

export async function removeLatestAccount(): Promise<void> {
    const manager = get(profileManager)
    return manager.removeLatestAccount()
}
