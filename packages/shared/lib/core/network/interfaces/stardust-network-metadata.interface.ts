import { IBaseToken } from '@core/wallet'
import { NetworkId } from '../enums'
import { INodeInfoProtocol } from '@iota/sdk'

/**
 * Holds relevant data
 * necessary for interacting within the context
 * of a particular network.
 */
export interface IStardustNetworkMetadata {
    id: NetworkId
    name: string
    coinType: number
    protocol: INodeInfoProtocol
    baseToken: IBaseToken
}
