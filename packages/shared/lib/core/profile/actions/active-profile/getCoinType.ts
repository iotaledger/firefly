import { COIN_TYPE } from '@core/network/constants'
import { activeProfile } from '@core/profile/stores'
import { get } from 'svelte/store'

export function getCoinType(): string {
    const $activeProfile = get(activeProfile)
    return COIN_TYPE[$activeProfile?.network?.id].toString()
}
