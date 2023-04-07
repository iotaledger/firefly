import { get } from 'svelte/store'
import { NETWORK_ADDRESS } from '@core/layer-2/constants'
import { activeProfile } from '@core/profile/stores'

export function getLayer2NetworkFromAddress(address: string): string {
    const networkType = get(activeProfile)?.networkType
    const entry = Object.entries(NETWORK_ADDRESS[networkType]).find((network) => network[1] === address)
    return entry?.[0]
}
