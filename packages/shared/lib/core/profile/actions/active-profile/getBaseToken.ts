import { activeProfile } from '@core/profile/stores'
import { IBaseToken } from '@core/wallet'
import { get } from 'svelte/store'

export function getBaseToken(): IBaseToken {
    const $activeProfile = get(activeProfile)
    return $activeProfile?.network?.baseToken
}
