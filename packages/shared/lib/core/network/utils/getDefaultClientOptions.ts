import { NetworkProtocol, NetworkType } from '../enums'
import { IClientOptions } from '../interfaces'
import { getOfficialNodes } from './getOfficialNodes'

export function getDefaultClientOptions(networkProtocol: NetworkProtocol, networkType: NetworkType): IClientOptions {
    const nodes = getOfficialNodes(networkProtocol, networkType)
    return { nodes }
}
