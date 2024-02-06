import { activeProfile, IProfile, lockStronghold } from '@core/profile'
import { get } from 'svelte/store'
import { setTimeStrongholdLastUnlocked } from '@core/profile/stores'
import { setStrongholdPassword } from '@core/wallet/actions'

export async function unlockStronghold(password: string, profile: IProfile = get(activeProfile)): Promise<void> {
    const { isStrongholdLocked } = profile
    try {
        await setStrongholdPassword(password)
        isStrongholdLocked.set(false)
        setTimeStrongholdLastUnlocked()
    } catch (err) {
        try {
            await lockStronghold()
        } catch (err) {
            console.error(err)
        }
        console.error(err)
        throw new Error('error.password.incorrect')
    }
}
