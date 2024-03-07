import { COIN_TYPE } from '../constants'
import { NetworkId } from '../enums'
import { IStardustNetworkMetadata } from '../interfaces'
import { NetworkMetadata } from '../types'
import { nodeInfoBaseToken, nodeInfoProtocol } from '../stores/node-info.store'
import { get } from 'svelte/store'

export const DEFAULT_NETWORK_METADATA: Readonly<{ [key in NetworkId]?: NetworkMetadata }> = {
    [NetworkId.Shimmer]: <IStardustNetworkMetadata>{
        id: NetworkId.Shimmer,
        name: 'Shimmer',
        coinType: COIN_TYPE[NetworkId.Shimmer],
        protocol: get(nodeInfoProtocol),
        baseToken: get(nodeInfoBaseToken),
    },
    [NetworkId.Testnet]: <IStardustNetworkMetadata>{
        id: NetworkId.Testnet,
        name: 'Testnet',
        coinType: COIN_TYPE[NetworkId.Testnet],
        protocol: get(nodeInfoProtocol),
        baseToken: get(nodeInfoBaseToken),
    },
    [NetworkId.Iota]: <IStardustNetworkMetadata>{
        id: NetworkId.Iota,
        name: 'IOTA',
        coinType: COIN_TYPE[NetworkId.Iota],
        protocol: get(nodeInfoProtocol),
        baseToken: get(nodeInfoBaseToken),
    },
    [NetworkId.IotaAlphanet]: <IStardustNetworkMetadata>{
        id: NetworkId.IotaAlphanet,
        name: 'IOTA Alphanet',
        coinType: COIN_TYPE[NetworkId.IotaAlphanet],
        protocol: get(nodeInfoProtocol),
        baseToken: get(nodeInfoBaseToken),
    },
}
