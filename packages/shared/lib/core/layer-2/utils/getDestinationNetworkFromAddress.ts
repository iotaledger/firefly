import { get } from 'svelte/store'
import { activeProfile } from '@core/profile'
import { NETWORK_ADDRESS } from '../constants'
import { DestinationNetwork } from '../enums'

export function getDestinationNetworkFromAddress(networkAddress: string): string {
    const foundDestinationNetwork = Object.entries(NETWORK_ADDRESS[get(activeProfile)?.networkType]).find(
        (networkAddressEntry) => networkAddressEntry[1] === networkAddress
    )?.[0]

    return foundDestinationNetwork ?? DestinationNetwork.Shimmer
}
