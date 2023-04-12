import { activeProfile } from '@core/profile/stores'
import { get } from 'svelte/store'

export function getNetworkHrp(): string {
    const $activeProfile = get(activeProfile)
    return $activeProfile.network.protocol.bech32Hrp
}
