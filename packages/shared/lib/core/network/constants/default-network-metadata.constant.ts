import { COIN_TYPE, DEFAULT_BASE_TOKEN } from '../constants'
import { NetworkId, TokenSupply } from '../enums'
import { IStardustNetworkMetadata } from '../interfaces'
import { NetworkMetadata } from '../types'

export const DEFAULT_NETWORK_METADATA: Readonly<{ [key in NetworkId]?: NetworkMetadata }> = {
    [NetworkId.Shimmer]: <IStardustNetworkMetadata>{
        id: NetworkId.Shimmer,
        name: 'Shimmer',
        coinType: COIN_TYPE[NetworkId.Shimmer],
        protocol: {
            version: 2,
            networkName: 'shimmer',
            bech32Hrp: 'smr',
            minPowScore: 1500,
            belowMaxDepth: 15,
            rentStructure: {
                vByteCost: 100,
                vByteFactorData: 1,
                vByteFactorKey: 10,
            },
            tokenSupply: TokenSupply.Shimmer,
        },
        baseToken: DEFAULT_BASE_TOKEN[NetworkId.Shimmer],
    },
    [NetworkId.Iota]: <IStardustNetworkMetadata>{
        id: NetworkId.Iota,
        name: 'IOTA',
        coinType: COIN_TYPE[NetworkId.Iota],
        protocol: {
            version: 2,
            networkName: 'iota',
            bech32Hrp: 'iota',
            minPowScore: 1500,
            belowMaxDepth: 15,
            rentStructure: {
                vByteCost: 100,
                vByteFactorData: 1,
                vByteFactorKey: 10,
            },
            tokenSupply: TokenSupply.Iota,
        },
        baseToken: DEFAULT_BASE_TOKEN[NetworkId.Iota],
    },
    [NetworkId.IotaAlphanet]: <IStardustNetworkMetadata>{
        id: NetworkId.IotaAlphanet,
        name: 'IOTA Alphanet',
        coinType: COIN_TYPE[NetworkId.IotaAlphanet],
        protocol: {
            version: 2,
            networkName: 'iota-alphanet-2',
            bech32Hrp: 'atoi',
            minPowScore: 1500,
            belowMaxDepth: 15,
            rentStructure: {
                vByteCost: 100,
                vByteFactorData: 1,
                vByteFactorKey: 10,
            },
            tokenSupply: TokenSupply.Iota,
        },
        baseToken: DEFAULT_BASE_TOKEN[NetworkId.IotaAlphanet],
    },
}
