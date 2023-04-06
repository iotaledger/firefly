import { ITokenMetadata } from '@core/wallet'
import { Network } from '../enums'
import { IProtocol } from './protocol.interface'

/**
 * Holds relevant data
 * necessary for interacting within the context
 * of a particular network.
 */
export interface INetwork {
    id: Network
    name: string
    protocol: IProtocol
    baseToken?: ITokenMetadata
}
