import { activeProfile } from '@core/profile'
import { get } from 'svelte/store'
import { NetworkProtocol, NetworkType } from '../enums'
import { IClientOptions } from '../interfaces'
import { getOfficialNetwork } from './getOfficialNetwork'
import { getOfficialNodes } from './getOfficialNodes'

export function getDefaultClientOptions(protocol: NetworkProtocol): IClientOptions {
    const { id, type } =
        get(activeProfile)?.settings?.networkConfig.network || getOfficialNetwork(protocol, NetworkType.Mainnet)

    const node = getOfficialNodes(protocol, type)[0]
    node.isPrimary = true

    return {
        node,
        nodes: getOfficialNodes(protocol, type).map((n) => ({ ...n, isPrimary: n.url === node.url })),
        network: id,
        automaticNodeSelection: true,
        includeOfficialNodes: true,
        localPow: true,
    }
}
