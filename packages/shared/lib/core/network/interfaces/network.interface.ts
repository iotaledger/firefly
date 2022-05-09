import { TokenMetadata } from '@lib/typings/assets'
import { NetworkProtocol } from '../enums/network-protocol.enum'
import { NetworkType } from '../enums/network-type.enum'

/**
 * Holds relevant data
 * necessary for interacting within the context
 * of a particular network.
 */
export interface INetwork {
    id: string
    name: string
    protocol: NetworkProtocol
    type: NetworkType
    bech32Hrp?: string
    baseToken?: TokenMetadata
}
