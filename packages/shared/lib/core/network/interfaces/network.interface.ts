import { ITokenMetadata } from '@core/wallet'
import { NetworkId, NetworkProtocol, NetworkType } from '../enums'
import { IRentStructure } from './rent-structure'

/**
 * Holds relevant data
 * necessary for interacting within the context
 * of a particular network.
 */
export interface INetwork {
    id: NetworkId
    name: string
    protocol: NetworkProtocol
    type: NetworkType
    bech32Hrp?: string
    baseToken?: ITokenMetadata
    rentStructure?: IRentStructure
}
