import { NetworkId } from '../enums'
import { IClientOptions } from '../interfaces'
import { getOfficialNodes } from './getOfficialNodes'

export function getDefaultClientOptions(networkId: NetworkId): IClientOptions {
    const nodes = getOfficialNodes(networkId)
    return { nodes }
}
