import { activeProfile } from '@core/profile'
import { get } from 'svelte/store'
import { NetworkId } from '../enums'

export function getActiveNetworkId(): NetworkId | undefined {
    return get(activeProfile)?.network?.id
}
