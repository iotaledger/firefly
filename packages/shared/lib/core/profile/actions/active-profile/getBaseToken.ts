import { BASE_TOKEN } from '@core/network/constants'
import { activeProfile } from '@core/profile/stores'
import { TokenMetadata } from '@core/wallet'
import { get } from 'svelte/store'

export function getBaseToken(): TokenMetadata {
    const $activeProfile = get(activeProfile)
    return BASE_TOKEN?.[$activeProfile?.networkProtocol]
}
