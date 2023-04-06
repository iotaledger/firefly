import { ITokenMetadata } from '@core/wallet'
import { NetworkId } from '../enums'
import { IProtocol } from './protocol.interface'

/**
 * Holds relevant data
 * necessary for interacting within the context
 * of a particular network.
 */
export interface INetwork {
    id: NetworkId
    name: string
    protocol: IProtocol
    baseToken?: ITokenMetadata
}
