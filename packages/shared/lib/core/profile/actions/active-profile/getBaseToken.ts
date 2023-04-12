import { BASE_TOKEN } from '@core/network/constants'
import { activeProfile } from '@core/profile/stores'
import { IBaseToken } from '@core/wallet'
import { get } from 'svelte/store'

export function getBaseToken(): IBaseToken {
    const $activeProfile = get(activeProfile)
    return BASE_TOKEN?.[$activeProfile?.networkProtocol]
}
