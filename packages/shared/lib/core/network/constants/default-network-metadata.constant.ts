import { COIN_TYPE } from '../constants'
import { NetworkId } from '../enums'
import { IStardustNetworkMetadata } from '../interfaces'
import { NetworkMetadata } from '../types'

export const DEFAULT_NETWORK_METADATA: Readonly<{ [key in NetworkId]?: NetworkMetadata }> = {
    [NetworkId.Shimmer]: <IStardustNetworkMetadata>{
        id: NetworkId.Shimmer,
        name: 'Shimmer',
        coinType: COIN_TYPE[NetworkId.Shimmer],
        bech32Hrp: 'smr',
    },
    [NetworkId.Testnet]: <IStardustNetworkMetadata>{
        id: NetworkId.Testnet,
        name: 'Testnet',
        coinType: COIN_TYPE[NetworkId.Testnet],
        bech32Hrp: 'rms',
    },
    [NetworkId.Iota]: <IStardustNetworkMetadata>{
        id: NetworkId.Iota,
        name: 'IOTA',
        coinType: COIN_TYPE[NetworkId.Iota],
        bech32Hrp: 'iota',
    },
    [NetworkId.IotaAlphanet]: <IStardustNetworkMetadata>{
        id: NetworkId.IotaAlphanet,
        name: 'IOTA Alphanet',
        coinType: COIN_TYPE[NetworkId.IotaAlphanet],
        bech32Hrp: 'atoi',
    },
}
