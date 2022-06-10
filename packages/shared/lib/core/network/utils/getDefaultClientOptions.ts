import { NetworkProtocol, NetworkType } from '../enums'
import { buildClientOptions } from '../helpers'
import { IClientOptions } from '../interfaces'
import { getOfficialNetwork } from './getOfficialNetwork'
import { getOfficialNodes } from './getOfficialNodes'

export function getDefaultClientOptions(networkProtocol: NetworkProtocol, networkType: NetworkType): IClientOptions {
    const network = getOfficialNetwork(networkProtocol, networkType)
    const nodes = getOfficialNodes(networkProtocol, networkType)
    return buildClientOptions(network, nodes)
}
