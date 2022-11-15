import { get } from 'svelte/store'
import { activeProfile } from '@core/profile'

import { NETWORK_ADDRESS } from '../constants'
import { DestinationNetwork } from '../enums'

export function isLayer1Destination(networkAddress: string): boolean {
    return (
        networkAddress === undefined ||
        networkAddress === NETWORK_ADDRESS[get(activeProfile)?.networkType][DestinationNetwork.Shimmer]
    )
}
