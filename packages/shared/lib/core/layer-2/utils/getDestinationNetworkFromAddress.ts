import { get } from 'svelte/store'
import { activeProfile } from '@core/profile'
import { DEFAULT_CHAINS } from '../constants'
import { DestinationNetwork } from '../enums'

export function getDestinationNetworkFromAddress(networkAddress: string): string {
    if (!networkAddress) {
        return DestinationNetwork.Shimmer
    }

    const networkId = get(activeProfile)?.network?.id
    const foundDestinationNetwork = Object.entries(DEFAULT_CHAINS[networkId]).find(
        (defaultChain) => defaultChain[1] === networkAddress
    )?.[0]

    return foundDestinationNetwork ?? networkAddress
}
