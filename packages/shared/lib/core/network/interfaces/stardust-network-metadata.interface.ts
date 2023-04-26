import { IBaseToken } from '@core/wallet'
import { NetworkId } from '../enums'
import { IProtocol } from './protocol.interface'

/**
 * Holds relevant data
 * necessary for interacting within the context
 * of a particular network.
 */
export interface IStardustNetworkMetadata {
    id: NetworkId
    name: string
    coinType: number
    protocol: IProtocol
    baseToken: IBaseToken
}
