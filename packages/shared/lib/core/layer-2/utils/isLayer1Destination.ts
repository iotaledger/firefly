import { get } from 'svelte/store'
import { activeProfile } from '@core/profile'

import { DEFAULT_CHAINS } from '../constants'
import { DestinationNetwork } from '../enums'

export function isLayer1Destination(networkAddress: string): boolean {
    return (
        networkAddress === undefined ||
        networkAddress === DEFAULT_CHAINS[get(activeProfile)?.network?.id][DestinationNetwork.Shimmer]
    )
}
