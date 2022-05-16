import { ITokenMetadata } from '@core/wallet'
import { NetworkProtocol } from '../enums/network-protocol.enum'
import { NetworkType } from '../enums/network-type.enum'
import { IRentStructure } from './rent-structure'

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
    baseToken?: ITokenMetadata
    rentStructure?: IRentStructure
}
