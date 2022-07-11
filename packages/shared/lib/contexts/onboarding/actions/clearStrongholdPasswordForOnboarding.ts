import { get } from 'svelte/store'

import { clearStrongholdPassword } from '@core/profile-manager'

import { strongholdPassword } from '../stores'

export async function clearStrongholdPasswordForOnboarding(): Promise<void> {
    if (get(strongholdPassword)) {
        await clearStrongholdPassword()
        strongholdPassword.set(null)
    }
}
