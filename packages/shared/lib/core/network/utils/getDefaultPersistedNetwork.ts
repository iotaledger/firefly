import { DEFAULT_NETWORK_METADATA } from '../constants'
import { NetworkId } from '../enums'
import { IPersistedNetwork } from '../interfaces'

export function getDefaultPersistedNetwork(networkId: NetworkId): IPersistedNetwork {
    const network = DEFAULT_NETWORK_METADATA?.[networkId]
    if (network) {
        return {
            ...network,
            chains: [],
        }
    } else {
        throw new Error(`Unable to find network: ${networkId}`)
    }
}
