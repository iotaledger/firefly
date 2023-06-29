import { DEFAULT_CHAIN_CONFIGURATIONS, DEFAULT_NETWORK_METADATA } from '../constants'
import { NetworkId } from '../enums'
import { IPersistedNetwork } from '../interfaces'

export function getDefaultPersistedNetwork(networkId: NetworkId): IPersistedNetwork {
    const network = DEFAULT_NETWORK_METADATA?.[networkId]
    const configuration = DEFAULT_CHAIN_CONFIGURATIONS?.[networkId]
    const chainConfigurations = configuration ? [configuration] : []
    if (network) {
        return {
            ...network,
            /**
             * CAUTION: If this function is called on existing profiles,
             * it is possible that that profile's chains will be overwritten
             * with this statement.
             */
            chains: [...chainConfigurations],
        }
    } else {
        throw new Error(`Unable to find network: ${networkId}`)
    }
}
