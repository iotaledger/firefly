import { NetworkId } from '../enums'

/**
 * Holds relevant data
 * necessary for interacting within the context
 * of a particular network.
 */
export interface IStardustNetworkMetadata {
    id: NetworkId
    name: string
    coinType: number
    bech32Hrp: string
}
