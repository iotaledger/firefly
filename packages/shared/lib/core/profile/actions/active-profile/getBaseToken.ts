import { BASE_TOKEN } from '@core/network/constants'
import { activeProfile } from '@core/profile/stores'
import { ITokenMetadata } from '@core/wallet'
import { get } from 'svelte/store'

export function getBaseToken(): ITokenMetadata {
    const $activeProfile = get(activeProfile)
    return BASE_TOKEN?.[$activeProfile?.networkProtocol]
}
