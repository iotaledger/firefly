import { activeProfile } from '@core/profile/stores'
import { get } from 'svelte/store'

export function getCoinType(): string {
    const $activeProfile = get(activeProfile)
    return String($activeProfile?.network?.coinType)
}
