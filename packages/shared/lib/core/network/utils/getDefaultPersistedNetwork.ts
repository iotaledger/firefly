import { DEFAULT_NETWORK_METADATA } from '../constants'
import { NetworkId } from '../enums'
import { IPersistedNetwork } from '../interfaces'
import { NetworkMetadata } from '../types'

export function getDefaultPersistedNetwork(id: NetworkId): IPersistedNetwork {
    return {
        ...(DEFAULT_NETWORK_METADATA[id] ?? <NetworkMetadata>{}),
        chains: [],
    }
}
