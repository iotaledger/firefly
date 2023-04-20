import { get } from 'svelte/store'
import { NETWORK_ADDRESS } from '@core/layer-2/constants'
import { activeProfile } from '@core/profile/stores'

export function getLayer2NetworkFromAddress(address: string): string {
    const networkId = get(activeProfile)?.network?.id
    const entry = Object.entries(NETWORK_ADDRESS[networkId]).find((network) => network[1] === address)
    return entry?.[0]
}
