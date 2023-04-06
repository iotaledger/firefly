import { get } from 'svelte/store'
import { NETWORK_ADDRESS } from '@core/layer-2/constants'
import { activeProfile } from '@core/profile/stores'

export function getLayer2NetworkFromAddress(address: string): string {
    for (const network of Object.entries(NETWORK_ADDRESS[get(activeProfile)?.networkType])) {
        if (network[1] === address) {
            return network[0]
        }
    }
    return undefined
}
